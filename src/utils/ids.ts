// Próximo id numérico livre da coleção; continua após ids antigos baseados em timestamp
export function nextId(list: { id: number }[]) {
  return list.reduce((max, x) => Math.max(max, x.id), 0) + 1;
}

// Id textual para conexões. Não usa crypto.randomUUID, que só existe em
// contexto seguro e falharia ao abrir o dev server pelo IP da rede.
export function randomId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
