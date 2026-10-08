export const STORAGE_PREFIX = "paginas_cenas_";
export const SCHEMA_VERSION = 1;

const VERSION_KEY = `${STORAGE_PREFIX}schema`;

// migrations[n] leva os dados da versão n - 1 para a versão n.
// Dados antigos, sem versão, contam como versão 0.
const migrations: Record<number, () => void> = {
  // A v0 já tem o formato da v1 (createdAt é opcional); só passa a ser versionada
  1: () => {},
};

export function migrateStorage() {
  try {
    const current = Number(localStorage.getItem(VERSION_KEY) ?? 0);
    // Dados de uma versão mais nova do app: não mexe
    if (current >= SCHEMA_VERSION) return;
    for (let v = current + 1; v <= SCHEMA_VERSION; v++) migrations[v]?.();
    localStorage.setItem(VERSION_KEY, String(SCHEMA_VERSION));
  } catch {
    // Sem acesso ao storage: o app segue em memória
  }
}
