import { useEffect, useState } from "react";

// useState sincronizado com o localStorage. Dados ausentes ou corrompidos
// caem no valor inicial em vez de derrubar o app.
//
// `sanitize` valida o valor lido e pode descartar partes inválidas. Se o
// valor salvo for descartado ou alterado, o original vai para `${key}_backup`
// antes de ser sobrescrito, para não perder dados do usuário.
export function usePersistentState<T>(
  key: string,
  initial: T,
  sanitize?: (raw: unknown) => T,
) {
  const [value, setValue] = useState<T>(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(key);
      if (!saved) return initial;
      const raw: unknown = JSON.parse(saved);
      const clean = sanitize ? sanitize(raw) : (raw as T);
      if (JSON.stringify(clean) !== JSON.stringify(raw)) backup(key, saved);
      return clean;
    } catch {
      if (saved) backup(key, saved);
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Armazenamento indisponível (modo privado, cota cheia): segue só em memória
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function backup(key: string, saved: string) {
  try {
    localStorage.setItem(`${key}_backup`, saved);
  } catch {
    // Sem espaço para o backup: não há o que fazer
  }
}
