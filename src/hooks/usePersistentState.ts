import { useEffect, useState } from "react";

// useState sincronizado com o localStorage. Dados ausentes ou corrompidos
// caem no valor inicial em vez de derrubar o app.
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initial;
    } catch {
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
