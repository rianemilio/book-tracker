# Páginas & Cenas

Diário de leituras e sessões para livros, filmes/séries e mangás/HQs. Registre o progresso de cada obra, o humor e o contexto de cada sessão, guarde os momentos que marcaram e ligue obras entre si num mapa de conexões temáticas.

**[Abrir o app →](https://rianemilio.github.io/book-tracker/)**

<!-- Print da tela: salve a imagem em docs/screenshot.png e descomente a linha abaixo -->
<!-- ![Tela inicial do Páginas & Cenas](docs/screenshot.png) -->

Os dados ficam no `localStorage` do navegador. Não há backend. Pelo link "seus dados · backup", no rodapé, dá pra exportar tudo num arquivo JSON, importar um backup ou começar do zero.

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

## Deploy

O workflow `.github/workflows/deploy.yml` roda os testes, gera o build e publica no GitHub Pages a cada push na `main`. Para funcionar, em **Settings → Pages** do repositório a fonte precisa estar como **GitHub Actions**. O build usa caminhos relativos (`base: "./"`), então funciona no subcaminho `/book-tracker/` sem configuração extra.

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
  App.tsx            monta a tela: cabeçalho, aba ativa e modal aberto
  views/             abas (início, sessões, mapa e momentos) e a página da obra
  components/home/   seções da aba início (contadores, cards, concluídas, momentos)
  components/journal/ cards de sessão e momento, filtros e painel de hábitos
  components/map/    grafo SVG e card de detalhes da aba mapa
  components/layout/ cabeçalho e abas
  components/modals/ formulários de obra, sessão, momento, conexão e backup
  components/ui/     Modal, CustomSelect, ConfirmButton, pickers, barra de rolagem e helpers
  hooks/             useLibrary (dados e operações), usePersistentState, useMediaQuery
  data/              dados de exemplo da primeira visita
  storage/           validação dos dados salvos, versão/migrações do formato e backup
  utils/             regras de progresso, conexões, filtros, hábitos, ids, datas e layout do mapa
  styles/            CSS por área, importado em ordem por index.css
  test/              setup compartilhado dos testes (Vitest + Testing Library)
  constants.ts       rótulos, humores, contextos e tags
  types.ts           tipos do domínio
```

Os testes ficam ao lado do código que testam (`*.test.ts(x)`).

Os estilos ficam em `src/styles/`, um arquivo por área (botões, formulários, layout, cada aba...), cada um com as próprias regras de celular no fim. A paleta é definida em variáveis CSS em `tokens.css`, e a cor de cada tipo de obra vem de `data-type` e da variável `--type-color`.

## Créditos e licença

A interface é inspirada na estética de Persona 5. É um projeto pessoal, sem afiliação com a Atlus ou a Sega, e não usa nenhum asset do jogo.

Os dados de exemplo citam obras reais (título e autor) apenas como referência; os direitos pertencem aos respectivos autores e editoras.

Código sob a licença [MIT](LICENSE).
