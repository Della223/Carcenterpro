import { useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from '../ui/Badge';
import type { CalendarDayInfo } from '../../types';

interface FinanceCalendarProps {
  calendar: CalendarDayInfo[];
  consecutiveEmptyDays: number;
  month: number;
  year: number;
  onDayClick: (date: string) => void;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function FinanceCalendar({
  calendar, consecutiveEmptyDays, month, year, onDayClick,
}: FinanceCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const handleDayClick = (day: CalendarDayInfo) => {
    if (day.isWeekend) return;
    setSelectedDate(day.date);
    onDayClick(day.date);
  };

  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-ink-900">Calendário Financeiro</h3>
          <Badge variant="info" size="sm">{MONTH_NAMES[month - 1]}/{year}</Badge>
        </div>
        <div className="flex items-center gap-2 text-ink-400">
          <ChevronLeft className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      {consecutiveEmptyDays >= 2 && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg bg-error-50 p-3 animate-fade-in">
          <AlertTriangle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5 text-error-600" />
          <div>
            <p className="text-sm font-semibold text-error-700">ATENÇÃO</p>
            <p className="text-xs text-error-600">
              Existem {consecutiveEmptyDays} dias úteis consecutivos sem movimentação financeira.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1.5">
        {WEEK_DAYS.map((d, i) => (
          <div key={i} className="text-center text-xs font-medium text-ink-400 py-1">
            {d}
          </div>
        ))}

        {emptyCells.map((i) => (
          <div key={`empty-${i}`} />
        ))}

        {calendar.map((day) => {
          let bgClass = 'bg-white ring-1 ring-ink-200 hover:ring-primary-400 hover:shadow-sm';
          let textClass = 'text-ink-700';
          let dotClass = '';

          if (day.isWeekend) {
            bgClass = 'bg-ink-50';
            textClass = 'text-ink-300';
          } else if (day.isToday) {
            bgClass = 'bg-primary-600 text-white';
            textClass = 'text-white';
          } else if (day.hasMovement) {
            bgClass = 'bg-success-50 ring-1 ring-success-200';
            textClass = 'text-success-700';
          } else {
            bgClass = 'bg-error-50 ring-1 ring-error-200';
            textClass = 'text-error-700';
          }

          if (day.hasRevenue && day.hasExpense) {
            dotClass = 'bg-primary-500';
          } else if (day.hasRevenue) {
            dotClass = 'bg-success-500';
          } else if (day.hasExpense) {
            dotClass = 'bg-accent-500';
          }

          return (
            <button
              key={day.date}
              onClick={() => handleDayClick(day)}
              disabled={day.isWeekend}
              className={`relative flex flex-col items-center justify-center rounded-lg py-2 text-sm font-medium transition-all ${bgClass} ${textClass} ${
                !day.isWeekend ? 'cursor-pointer hover:scale-105' : 'cursor-default'
              }`}
              title={
                day.isWeekend ? 'Final de semana' :
                day.isToday ? 'Hoje' :
                day.hasMovement ? 'Movimentação registrada' : 'Dia útil sem movimentação'
              }
            >
              {day.day}
              {dotClass && (
                <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${dotClass}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-3">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-success-50 ring-1 ring-success-200" />
          <span className="text-xs text-ink-500">Movimentação</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-error-50 ring-1 ring-error-200" />
          <span className="text-xs text-ink-500">Sem movimentação</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-primary-600" />
          <span className="text-xs text-ink-500">Hoje</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-ink-50" />
          <span className="text-xs text-ink-500">Final de semana</span>
        </div>
      </div>

      {selectedDate && (
        <p className="mt-3 text-xs text-primary-600">
          Clique em um dia útil para abrir o lançamento.
        </p>
      )}
    </div>
  );
}
