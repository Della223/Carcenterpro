import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ScreenId } from '../config/navigation';

interface SearchResult {
  id: string;
  type: 'revenue' | 'expense' | 'supplier' | 'category' | 'subcategory' | 'cost_center';
  title: string;
  subtitle: string;
  screen: ScreenId;
  recordId?: string;
}

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId, recordId?: string) => void;
}

export default function GlobalSearch({ open, onClose, onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const [revs, exps, sups, revCats, expCats, subCats, costCenters] = await Promise.all([
        supabase.from('revenues').select('id, revenue_date, amount, notes, category:revenue_categories(name), main_category:revenue_main_categories(name), subcategory:revenue_subcategories(name)').ilike('notes', `%${q}%`).limit(5),
        supabase.from('expenses').select('id, supplier, competence_month, competence_year, total_amount, category:expense_categories(name)').or(`supplier.ilike.%${q}%,description.ilike.%${q}%`).limit(5),
        supabase.from('suppliers').select('id, name').ilike('name', `%${q}%`).limit(5),
        supabase.from('revenue_categories').select('id, name').ilike('name', `%${q}%`).limit(5),
        supabase.from('expense_categories').select('id, name').ilike('name', `%${q}%`).limit(5),
        supabase.from('expense_subcategories').select('id, name, category:expense_categories(name)').ilike('name', `%${q}%`).limit(5),
        supabase.from('cost_centers').select('id, name').ilike('name', `%${q}%`).limit(5),
      ]);

      const items: SearchResult[] = [];
      for (const r of revs.data ?? []) {
        const rAny = r as Record<string, unknown>;
        const catName = (rAny.main_category as { name?: string })?.name ?? (rAny.category as { name?: string })?.name ?? '-';
        items.push({ id: r.id, type: 'revenue', title: `Receita: ${catName}`, subtitle: `R$ ${r.amount} — ${r.revenue_date}`, screen: 'comercial', recordId: r.id });
      }
      for (const e of exps.data ?? []) {
        const eAny = e as Record<string, unknown>;
        const catName = (eAny.category as { name?: string })?.name ?? '-';
        items.push({ id: e.id, type: 'expense', title: `Despesa: ${e.supplier ?? catName ?? '-'}`, subtitle: `R$ ${e.total_amount} — ${String(e.competence_month).padStart(2, '0')}/${e.competence_year}`, screen: 'despesas', recordId: e.id });
      }
      for (const s of sups.data ?? []) {
        items.push({ id: s.id, type: 'supplier', title: `Fornecedor: ${s.name}`, subtitle: 'Fornecedor', screen: 'configuracoes' });
      }
      for (const c of revCats.data ?? []) {
        items.push({ id: c.id, type: 'category', title: `Categoria: ${c.name}`, subtitle: 'Categoria de Receita', screen: 'configuracoes' });
      }
      for (const c of expCats.data ?? []) {
        items.push({ id: c.id, type: 'category', title: `Categoria: ${c.name}`, subtitle: 'Categoria de Despesa', screen: 'configuracoes' });
      }
      for (const s of subCats.data ?? []) {
        const sAny = s as Record<string, unknown>;
        const catName = (sAny.category as { name?: string })?.name ?? '-';
        items.push({ id: s.id, type: 'subcategory', title: `Subcategoria: ${s.name}`, subtitle: `Categoria: ${catName}`, screen: 'configuracoes' });
      }
      for (const c of costCenters.data ?? []) {
        items.push({ id: c.id, type: 'cost_center', title: `Centro de Custo: ${c.name}`, subtitle: 'Centro de Custo', screen: 'configuracoes' });
      }
      setResults(items);
      setSelectedIndex(0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (!open) return;
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        onNavigate(results[selectedIndex].screen, results[selectedIndex].recordId);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [open, results, selectedIndex, onClose, onNavigate]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[10vh] px-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-xl animate-scale-in">
        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-ink-200/60 overflow-hidden">
          <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3">
            <Search className="h-5 w-5 text-ink-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar receitas, despesas, fornecedores, categorias..."
              className="flex-1 border-0 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-0"
            />
            <button onClick={onClose} className="rounded-lg p-1 text-ink-400 hover:bg-ink-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-[50vh] overflow-y-auto scrollbar-thin">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm text-ink-500">Pesquisando...</div>
            ) : results.length === 0 ? (
              query.trim().length >= 2 ? (
                <div className="px-4 py-8 text-center text-sm text-ink-500">Nenhum resultado encontrado.</div>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-ink-400">Digite para pesquisar...</div>
              )
            ) : (
              results.map((r, i) => (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => { onNavigate(r.screen, r.recordId); onClose(); }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${i === selectedIndex ? 'bg-primary-50' : 'hover:bg-ink-50'}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-900 truncate">{r.title}</p>
                    <p className="text-xs text-ink-500 truncate">{r.subtitle}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink-400 flex-shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
