# CV Match

Ferramenta open-source de análise ATS (Applicant Tracking System) com IA. Cole seu currículo e uma descrição de vaga para receber uma pontuação de 0 a 100, análise de pontos fortes/fracos, correspondência de palavras-chave, sugestões de melhoria e a opção de gerar um CV otimizado para a vaga. O usuário fornece sua própria chave de API (BYOK) e escolhe o provedor de IA.

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Monorepo | Turborepo + pnpm |
| API | Hono + Cloudflare Workers |
| Frontend | Next.js 16 + React 19 + shadcn/ui + Tailwind CSS 4 |
| IA | Vercel AI SDK (OpenAI, Anthropic, Google) |
| Validação | Zod |
| Qualidade | TypeScript, Biome, Vitest, Lefthook |

## Estrutura do Projeto

```
cv-match/
├── apps/
│   ├── api/          # API — Hono + Cloudflare Workers
│   └── web/          # Frontend — Next.js 16
├── docs/             # Requisitos, regras de negócio, PRD
├── scripts/          # Scripts utilitários
├── turbo.json        # Configuração do Turborepo
└── pnpm-workspace.yaml
```

## Pre-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) 10.33.0+

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/cv-match.git
cd cv-match

# Instale as dependências
pnpm install
```

## Rodando em Desenvolvimento

```bash
# Inicia API (porta 8787) e Web (porta 3000) simultaneamente
pnpm dev
```

Ou rode cada app individualmente:

```bash
# Apenas a API
pnpm dev --filter=api

# Apenas o frontend
pnpm dev --filter=web
```

Acesse o frontend em [http://localhost:3000](http://localhost:3000). A API estará disponível em [http://localhost:8787](http://localhost:8787).

## Variáveis de Ambiente

### Web (`apps/web`)

| Variável | Descrição | Default |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL base da API | `http://localhost:8787` |

Em desenvolvimento, o default funciona sem configuração adicional. Para produção, defina a URL da API deployada.

> **Nota:** Não há variáveis de ambiente com credenciais. As chaves de API dos provedores de IA são fornecidas pelo usuário a cada requisição e nunca são armazenadas.

## Scripts Disponíveis

Todos os comandos abaixo podem ser executados na raiz do monorepo:

```bash
pnpm dev          # Desenvolvimento (API + Web)
pnpm build        # Build de todas as apps
pnpm lint         # Lint com Biome
pnpm format       # Formatação com Biome
pnpm type-check   # Verificação de tipos TypeScript
pnpm test         # Executa todos os testes
pnpm clean        # Remove node_modules, dist e .turbo
```

### Scripts específicos da API (`apps/api`)

```bash
pnpm --filter=api test         # Roda os 132 testes da API
pnpm --filter=api test:watch   # Testes em modo watch
pnpm --filter=api deploy       # Deploy para Cloudflare Workers
```

## Como Usar

1. Rode `pnpm dev` e acesse [http://localhost:3000](http://localhost:3000)
2. Faça upload do seu currículo (PDF ou LaTeX)
3. Cole a descrição da vaga
4. Selecione o provedor de IA (OpenAI, Anthropic ou Google)
5. Insira sua chave de API do provedor escolhido
6. Clique em **Analisar** para receber a análise ATS
7. Opcionalmente, clique em **Melhorar meu CV** para gerar uma versão otimizada

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Health check |
| `POST` | `/analyze` | Análise ATS do currículo |
| `POST` | `/improve` | Geração de CV melhorado + re-score |

## Licença

Open source.
