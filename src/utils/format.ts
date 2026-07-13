export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value || 0);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0) + '%';
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('pt-BR');
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getCompetenceString(month: number, year: number): string {
  return `${String(month).padStart(2, '0')}/${year}`;
}

export function parseCompetence(competence: string): { month: number; year: number } {
  const [month, year] = competence.split('/');
  return { month: parseInt(month, 10), year: parseInt(year, 10) };
}

export function getCurrentCompetence(): { month: number; year: number } {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

export function getPreviousCompetence(month: number, year: number): { month: number; year: number } {
  if (month === 1) return { month: 12, year: year - 1 };
  return { month: month - 1, year };
}

export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

export function getElapsedDays(month: number, year: number): number {
  const now = new Date();
  if (now.getFullYear() === year && now.getMonth() + 1 === month) {
    return now.getDate();
  }
  return getDaysInMonth(month, year);
}

export function calculateProjection(revenueAccumulated: number, elapsedDays: number, totalDays: number): number {
  if (elapsedDays === 0) return 0;
  return (revenueAccumulated / elapsedDays) * totalDays;
}

export function calculateMonthlyEvolution(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function calculateBudgetExecution(planned: number, actual: number): {
  difference: number;
  differencePercent: number;
  executionPercent: number;
} {
  const difference = actual - planned;
  const differencePercent = planned > 0 ? (difference / planned) * 100 : 0;
  const executionPercent = planned > 0 ? (actual / planned) * 100 : 0;
  return { difference, differencePercent, executionPercent };
}

export function roundHalfUp(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  const csvContent = [
    headers.join(';'),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(';')),
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function printContent(title: string, content: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <html><head><title>${title}</title>
    <style>
      body { font-family: sans-serif; padding: 24px; }
      h1 { font-size: 18px; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background: #f5f5f5; }
    </style></head><body><h1>${title}</h1>${content}</body></html>
  `);
  printWindow.document.close();
  printWindow.print();
}
