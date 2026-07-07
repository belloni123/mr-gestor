"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// true somente após a hidratação no cliente; false no servidor e no primeiro
// paint. Permite renderizar conteúdo dependente de Date/localStorage sem
// divergência de hidratação e sem setState dentro de effects.
export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
