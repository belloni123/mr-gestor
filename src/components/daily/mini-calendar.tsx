"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useHydrated } from "@/components/use-hydrated";

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const dayNames = ["D", "S", "T", "Q", "Q", "S", "S"];

// Feriados nacionais 2026 (inclui Carnaval, Sexta-feira Santa e Corpus Christi)
const holidays2026 = new Set([
  "1-1",
  "2-16",
  "2-17",
  "4-3",
  "4-21",
  "5-1",
  "6-4",
  "9-7",
  "10-12",
  "11-2",
  "11-15",
  "11-20",
  "12-25",
]);

function isHoliday(year: number, month: number, day: number) {
  return year === 2026 && holidays2026.has(`${month + 1}-${day}`);
}

export function MiniCalendar() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div className="mini-calendar loading">Carregando calendário...</div>;
  }

  return <CalendarBoard />;
}

// Montado somente no cliente, então pode inicializar com a data local.
function CalendarBoard() {
  const [today] = useState(() => new Date());
  const [view, setView] = useState(() => ({ year: today.getFullYear(), month: today.getMonth() }));

  const firstDay = new Date(view.year, view.month, 1);
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const cells: Array<number | null> = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  function shiftMonth(delta: number) {
    setView((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  const isCurrentMonth = today.getFullYear() === view.year && today.getMonth() === view.month;

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <strong>
          {monthNames[view.month]} {view.year}
        </strong>
        <div className="mini-calendar-nav">
          <button onClick={() => shiftMonth(-1)} type="button" aria-label="Mês anterior">
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => shiftMonth(1)} type="button" aria-label="Próximo mês">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
      <div className="mini-calendar-grid" role="grid" aria-label={`Calendário de ${monthNames[view.month]} de ${view.year}`}>
        {dayNames.map((day, index) => (
          <span className="mini-calendar-dayname" key={`${day}-${index}`}>
            {day}
          </span>
        ))}
        {cells.map((day, index) => {
          if (day === null) {
            return <span className="mini-calendar-cell blank" key={`blank-${index}`} />;
          }
          const weekday = (leadingBlanks + day - 1) % 7;
          const holiday = isHoliday(view.year, view.month, day);
          const isToday = isCurrentMonth && day === today.getDate();
          const classNames = [
            "mini-calendar-cell",
            isToday ? "today" : "",
            holiday ? "holiday" : "",
            !holiday && (weekday === 0 || weekday === 6) ? "weekend" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <span className={classNames} key={day} title={holiday ? "Feriado nacional" : undefined}>
              {day}
            </span>
          );
        })}
      </div>
      <p className="mini-calendar-legend">
        <span className="dot holiday" /> Feriado nacional
      </p>
    </div>
  );
}
