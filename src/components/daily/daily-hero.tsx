"use client";

import { useHydrated } from "@/components/use-hydrated";

function buildGreeting(hour: number) {
  if (hour < 5) return "Boa madrugada";
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function DailyHero({ name }: { name: string }) {
  const hydrated = useHydrated();
  const now = hydrated ? new Date() : null;

  const firstName = name.split(" ")[0] ?? name;
  const greeting = now ? buildGreeting(now.getHours()) : "Olá";
  const longDate = now
    ? now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })
    : "";

  return (
    <div className="daily-greeting">
      <span className="eyebrow">Uso diário</span>
      <h1>
        {greeting}, {firstName}
      </h1>
      <p className="daily-date" aria-live="polite">
        {longDate ? longDate.charAt(0).toUpperCase() + longDate.slice(1) : "Carregando o seu dia..."}
      </p>
    </div>
  );
}
