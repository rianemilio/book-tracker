import type { Connection } from "../types";

// Conexões não têm direção: A→B e B→A são o mesmo vínculo
export function isConnected(connections: Connection[], a: number, b: number) {
  return connections.some(
    (c) => (c.fromId === a && c.toId === b) || (c.fromId === b && c.toId === a),
  );
}
