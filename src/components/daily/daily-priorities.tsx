"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";

import { useHydrated } from "@/components/use-hydrated";

type Priority = {
  id: string;
  label: string;
  time: string;
  done: boolean;
};

const defaultPriorities: Priority[] = [
  { id: "p1", label: "Revisar vencidos e disparar cobranças", time: "09:00", done: false },
  { id: "p2", label: "Atualizar próximos passos do funil no CRM", time: "11:00", done: false },
  { id: "p3", label: "Conferir alertas das empresas no dashboard", time: "14:00", done: false },
  { id: "p4", label: "Registrar avanços no cronograma estratégico", time: "17:00", done: false },
];

function storageKey(userId: string) {
  return `mr-gestor:daily-priorities:${userId}`;
}

function loadPriorities(userId: string): Priority[] {
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return defaultPriorities;
    const parsed = JSON.parse(raw) as Priority[];
    if (!Array.isArray(parsed)) return defaultPriorities;
    return parsed.filter((item) => item && typeof item.label === "string");
  } catch {
    return defaultPriorities;
  }
}

export function DailyPriorities({ userId }: { userId: string }) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="priorities-card">
        <div className="card-heading">
          <div>
            <span className="eyebrow">Carregando</span>
            <h2>Prioridades do dia</h2>
          </div>
        </div>
      </div>
    );
  }

  return <PrioritiesBoard userId={userId} />;
}

// Montado somente no cliente (após a hidratação), então pode inicializar o
// estado direto do localStorage.
function PrioritiesBoard({ userId }: { userId: string }) {
  const [items, setItems] = useState<Priority[]>(() => loadPriorities(userId));
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("");
  const idCounter = useRef(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey(userId), JSON.stringify(items));
    } catch {
      // storage indisponível (modo privado); a lista segue apenas em memória
    }
  }, [items, userId]);

  function toggle(id: string) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  }

  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function clearDone() {
    setItems((current) => current.filter((item) => !item.done));
  }

  function addItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;
    idCounter.current += 1;
    setItems((current) => [
      ...current,
      {
        id: `p-${Date.now()}-${idCounter.current}`,
        label: trimmed.slice(0, 140),
        time,
        done: false,
      },
    ]);
    setLabel("");
    setTime("");
  }

  const doneCount = items.filter((item) => item.done).length;

  return (
    <div className="priorities-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">
            {doneCount} de {items.length} concluídas
          </span>
          <h2>Prioridades do dia</h2>
        </div>
        {doneCount > 0 ? (
          <button className="text-action" onClick={clearDone} type="button">
            Limpar concluídas
          </button>
        ) : null}
      </div>

      <ul className="priority-list">
        {items.map((item) => (
          <li className={item.done ? "priority-row done" : "priority-row"} key={item.id}>
            <button
              className="priority-check"
              onClick={() => toggle(item.id)}
              type="button"
              aria-pressed={item.done}
              aria-label={item.done ? `Reabrir: ${item.label}` : `Concluir: ${item.label}`}
            >
              {item.done ? <Check size={14} /> : null}
            </button>
            <span className="priority-label">{item.label}</span>
            {item.time ? <span className="priority-time">{item.time}</span> : null}
            <button
              className="priority-remove"
              onClick={() => remove(item.id)}
              type="button"
              aria-label={`Remover: ${item.label}`}
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
        {!items.length ? <li className="empty-state">Sem prioridades. Adicione a primeira abaixo.</li> : null}
      </ul>

      <form className="priority-form" onSubmit={addItem}>
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Nova prioridade"
          aria-label="Nova prioridade"
          maxLength={140}
        />
        <input
          value={time}
          onChange={(event) => setTime(event.target.value)}
          type="time"
          aria-label="Horário (opcional)"
        />
        <button className="primary-pill" type="submit">
          <Plus size={15} />
          Adicionar
        </button>
      </form>
      <p className="priority-note">Salvo somente neste navegador, por usuário. Não substitui registros oficiais.</p>
    </div>
  );
}
