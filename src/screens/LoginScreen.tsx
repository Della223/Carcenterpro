import { Car, ShieldCheck, TrendingUp, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USER_LIST } from '../context/AuthContext';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administradora',
  financeiro: 'Financeiro',
  operador: 'Operador',
};

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex bg-ink-50">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/20">
              <Car className="h-7 w-7" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">CarCenter PRO</p>
              <p className="text-xs text-primary-200 font-medium">Finance 3.0</p>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Gestão financeira<br />de ponta a ponta<br />para o seu centro automotivo.
            </h1>
            <p className="text-primary-200 text-lg max-w-md">
              Controle completo de receitas, despesas, comissões, veículos e muito mais — em uma única plataforma.
            </p>
            <div className="flex gap-6 pt-4">
              <div className="flex items-center gap-2 text-primary-100">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Relatórios em tempo real</span>
              </div>
              <div className="flex items-center gap-2 text-primary-100">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-medium">Dados seguros</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-primary-300">© 2025 CarCenter PRO. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* User selection panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-bold text-ink-900">CarCenter PRO</p>
              <p className="text-xs text-ink-500 font-medium">Finance 3.0</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-ink-900 tracking-tight">Selecione seu perfil</h2>
          <p className="mt-1 text-sm text-ink-500">Escolha o usuário para acessar o sistema.</p>

          <div className="mt-8 space-y-3">
            {USER_LIST.map((u) => (
              <button
                key={u.email}
                onClick={() => login(u.email)}
                className="group flex w-full items-center gap-4 rounded-xl border border-ink-200 bg-white p-4 text-left transition-all hover:border-primary-300 hover:bg-primary-50 hover:shadow-md"
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-base font-bold text-primary-700 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  {u.avatarInitials}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900">{u.name}</p>
                  <p className="text-xs text-ink-500">{ROLE_LABELS[u.role] ?? u.role}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-ink-300 transition-colors group-hover:text-primary-500" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
