# Páginas & Cenas

Diário de leituras e sessões para livros, filmes/séries e mangás/HQs. Registre o progresso de cada obra, o humor e o contexto de cada sessão, guarde os momentos que marcaram e ligue obras entre si num mapa de conexões temáticas.

Os dados ficam no `localStorage` do navegador. Não há backend.

## Stack

React 19, TypeScript e Vite 8.

## Rodando

O ambiente de desenvolvimento roda em container:

```sh
podman-compose up --build
```

O app fica em <http://localhost:5173>. O código é montado como volume, então as alterações recarregam sozinhas.

Para rodar outros scripts sem subir o servidor:

```sh
podman run --rm -v "$PWD":/app:z -w /app node:22-alpine sh -c "npm ci && npm run build"
```

## Scripts

| Script                 | O que faz                                    |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Servidor de desenvolvimento do Vite          |
| `npm run build`        | Checagem de tipos e build de produção        |
| `npm run preview`      | Serve o build de produção localmente         |
| `npm run typecheck`    | Só a checagem de tipos                       |
| `npm run format`       | Formata `src/**/*.{ts,tsx,css}` com Prettier |
| `npm run lint`         | Roda o ESLint                                |
| `npm test`             | Roda os testes com Vitest                    |
| `npm run test:watch`   | Testes em modo watch                         |
| `npm run format:check` | Verifica a formatação sem alterar nada       |

## Estrutura

```
src/
  App.tsx            estado global, persistência e handlers
  views/             abas: início, mapa e momentos
  components/modals/ formulários de obra, sessão, momento e conexão
  components/ui/     Modal, CustomSelect, pickers e helpers visuais
  hooks/             usePersistentState (useState + localStorage)
  utils/             regras de progresso e formatação de datas
  test/              setup compartilhado dos testes (Vitest + Testing Library)
  constants.ts       paleta, humores, contextos, tags e dados de exemplo
  types.ts           tipos do domínio
```

Os testes ficam ao lado do código que testam (`*.test.ts(x)`). Os estilos ficam em `App.css`; as cores de cada tipo de obra vêm de `data-type` e da variável `--type-color`.
