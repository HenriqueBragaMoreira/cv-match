================================================================================
                        CV MATCH — ROADMAP DE DESENVOLVIMENTO
================================================================================

Projeto: CV Match — Análise ATS de currículo com IA (BYOK)
Stack: Turborepo + pnpm | API: Hono + Cloudflare Workers | Web: Next.js 16 + shadcn/ui
Última atualização: 2026-04-08

================================================================================
FASE 1 — SETUP & INFRAESTRUTURA DA API
================================================================================

1.1  [done] Instalar Vercel AI SDK e providers no app api
     - Adicionar @ai-sdk/openai, @ai-sdk/anthropic, @ai-sdk/google e ai como dependências
     - Refs: FR-004, NFR-004

1.2  [done] Instalar Zod no app api para validação de schemas
     - Adicionar zod como dependência para validar requests e responses
     - Refs: BR-004

1.3  [done] Criar estrutura de pastas da API
     - Organizar src/ com routes/, schemas/, prompts/, services/, utils/
     - Refs: NFR-001

1.4  [done] Configurar middleware global de error handling no Hono
     - Tratamento padronizado de erros (validação, provider, rede)
     - Garantir que API keys nunca vazem em respostas de erro
     - Refs: BR-002

1.5  [done] Configurar CORS no Hono
     - Permitir requests do frontend (localhost em dev, domínio em prod)

================================================================================
FASE 2 — SCHEMAS E VALIDAÇÃO (API)
================================================================================

2.1  [done] Definir schema Zod para request do endpoint /analyze
     - Request via multipart/form-data para suportar upload de arquivo
     - Campos: resumeFile (File .pdf ou .tex), jobDescription (string), provider (enum), apiKey (string)
     - Validação de tipo e tamanho do arquivo no schema
     - Refs: FR-001, FR-005, FR-003, FR-004

2.2  [done] Definir schema Zod para response do endpoint /analyze
     - Campos: score (int 0-100), strengths[], weaknesses[], suggestions[],
       keywords { present[], missing[] }, breakdown { experience, skills, education, certifications },
       formattingWarnings[]
     - Refs: FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, BR-004

2.3  [done] Definir schema Zod para request do endpoint /improve
     - Request via multipart/form-data para suportar upload de arquivo
     - Campos: resumeFile (File .pdf ou .tex), jobDescription (string),
       analysisResult (JSON string → validado com analyzeResponseSchema),
       provider (enum), apiKey (string)
     - Refs: FR-001, FR-012

2.4  [done] Definir schema Zod para response do endpoint /improve
     - Campos: improvedResume (string), changes (string), newScore (int 0-100)
     - Refs: FR-012, FR-013, BR-007

================================================================================
FASE 3 — PROMPTS DE IA (API)
================================================================================

3.1  [done] Criar prompt de sistema para análise ATS
     - Instruções rígidas de avaliação como um bot ATS real
     - Sem inferir qualificações que não estejam no currículo
     - Definir formato de saída estruturado (JSON) para o AI SDK
     - Refs: BR-003, BR-004

3.2  [done] Criar prompt de sistema para geração de CV melhorado
     - Instrução explícita para não fabricar experiência ou habilidades
     - Usar currículo original como fonte de verdade factual
     - Reorganizar, reformular e otimizar conteúdo existente
     - Refs: BR-006

3.3  [done] Garantir que o prompt de re-scoring do CV melhorado reutilize o mesmo prompt ATS
     - O endpoint /improve deve usar exatamente o mesmo prompt e parâmetros do /analyze
     - Refs: BR-005

================================================================================
FASE 4 — SERVIÇO DE PROVIDERS (API)
================================================================================

4.1  [done] Criar factory de providers do Vercel AI SDK
     - Recebe provider (string) + apiKey e retorna instância configurada do provider
     - Suportar: openai, anthropic, google
     - Refs: FR-004, NFR-004

4.2  [done] Implementar validação de formato de API key por provider
     - Validar padrão básico da key antes de enviar ao provider (ex: sk- para OpenAI)
     - Refs: FR-003, BR-002

================================================================================
FASE 5 — ENDPOINTS DA API
================================================================================

5.1  [done] Implementar endpoint POST /analyze
     - Receber e validar request multipart/form-data com Zod
     - Extrair texto do arquivo enviado (PDF ou LaTeX) usando parsers da Fase 6
     - Inicializar provider com API key do usuário
     - Enviar prompt ATS + texto extraído + job description ao modelo
     - Usar generateObject do AI SDK para resposta estruturada
     - Validar score no range [0, 100]
     - Retornar response no formato definido
     - Refs: FR-001, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, BR-003, BR-004

5.2  [done] Implementar endpoint POST /improve
     - Receber e validar request multipart/form-data com Zod
     - Extrair texto do arquivo enviado (PDF ou LaTeX) usando parsers da Fase 6
     - Gerar CV melhorado com prompt de improvement
     - Re-executar análise ATS no CV melhorado (mesmo prompt do /analyze)
     - Retornar CV melhorado + changes summary + novo score
     - Refs: FR-001, FR-012, FR-013, BR-005, BR-006, BR-007

5.3  [done] Implementar health check GET /
     - Endpoint simples para verificar se a API está online

================================================================================
FASE 6 — PARSING DE ARQUIVOS (API)  [depende da Fase 2 para schemas, executar antes da Fase 5]
================================================================================

6.1  [done] Recebimento de arquivo via multipart/form-data
     - Absorvido pela task 2.1 — schema já define resumeFile (File) via multipart/form-data
     - Refs: FR-001

6.2  [done] Instalar e configurar parser de PDF compatível com edge runtime
     - Extrair texto de arquivos .pdf
     - Refs: FR-001

6.3  [done] Implementar parser de arquivos .tex (LaTeX)
     - Strip de comandos LaTeX para obter texto puro
     - Refs: FR-001

6.4  [done] Validar tipo de arquivo (aceitar apenas .pdf e .tex, rejeitar outros)
     - Absorvido pela task 2.1 — schema Zod já valida extensão do arquivo
     - Refs: FR-001

================================================================================
FASE 7 — TESTES DA API
================================================================================

7.1  [done] Escrever testes unitários para schemas Zod
     - Validar que schemas aceitam dados válidos e rejeitam inválidos

7.2  [done] Escrever testes unitários para factory de providers
     - Testar criação de cada provider suportado

7.3  [done] Escrever testes unitários para parsers de arquivo (PDF e LaTeX)
     - Testar extração de texto e rejeição de formatos inválidos

7.4  [done] Escrever testes de integração para POST /analyze
     - Testar fluxo completo com mock do AI SDK
     - Validar formato de resposta, range de score, campos obrigatórios

7.5  [done] Escrever testes de integração para POST /improve
     - Testar fluxo completo com mock do AI SDK
     - Validar que re-scoring usa mesmo prompt

================================================================================
FASE 8 — SETUP DO FRONTEND
================================================================================

8.1  [done] Instalar dependências necessárias no app web
     - Adicionar componentes shadcn/ui necessários (input, textarea, select, card, tabs, alert, etc.)

8.2  [done] Criar layout base da aplicação
     - Header com nome do projeto
     - Container principal centralizado e responsivo
     - Footer com link para repositório
     - Texto em pt-BR
     - Refs: NFR-006, NFR-008

================================================================================
FASE 9 — FORMULÁRIO DE ANÁLISE (WEB)
================================================================================

9.1  [done] Criar componente de seleção de provider de IA
     - Dropdown listando providers suportados (OpenAI, Anthropic, Google)
     - Refs: FR-004

9.2  [done] Criar componente de input de API key
     - Campo tipo password com toggle de visibilidade
     - Placeholder com dica por provider selecionado
     - Armazenar apenas em React state
     - Refs: FR-003, BR-002

9.3  [done] Criar componente de upload de currículo
     - Drag-and-drop + clique para selecionar arquivo
     - Aceitar apenas .pdf e .tex
     - Exibir nome e tamanho do arquivo selecionado
     - Validação client-side de tipo de arquivo
     - Refs: FR-001

9.4  [done] Criar componente de input de descrição da vaga
     - Textarea com placeholder explicativo
     - Contador de caracteres
     - Refs: FR-002

9.5  [done] Criar componente do formulário completo de análise
     - Integrar provider, API key, upload de currículo e job description
     - Botão de submissão com estado de loading
     - Validação de campos obrigatórios antes de enviar
     - Refs: FR-005

9.6  [done] Implementar chamada à API /analyze
     - Enviar dados do formulário como multipart/form-data (arquivo + campos de texto)
     - Tratar erros (key inválida, rate limit, falha de rede, arquivo inválido)
     - Refs: FR-001, FR-005

================================================================================
FASE 10 — EXIBIÇÃO DE RESULTADOS DA ANÁLISE (WEB)
================================================================================

10.1 [done] Criar componente de exibição do score principal
     - Score 0-100 em destaque com indicador visual
     - Cor por faixa: 0-39 vermelho, 40-69 amarelo, 70-100 verde
     - Label explicativo do significado do score
     - Refs: FR-006, BR-004

10.2 [done] Criar componente de pontos fortes e fracos
     - Layout em duas colunas ou abas
     - Listas com distinção visual (ícones, cores)
     - Refs: FR-007

10.3 [done] Criar componente de sugestões de melhoria
     - Lista ordenada com indicadores de prioridade
     - Refs: FR-008

10.4 [done] Criar componente de análise de keywords
     - Keywords presentes (✓) e ausentes (✗) com cores
     - Refs: FR-009

10.5 [done] Criar componente de breakdown por seção
     - Barras de progresso por categoria (experiência, habilidades, educação, certificações)
     - Refs: FR-010

10.6 [done] Criar componente de alertas de formatação ATS
     - Banner ou lista de warnings com sugestões de correção
     - Refs: FR-011

10.7 [not implemented] Criar página/seção de resultados completos
     - Integrar todos os componentes de resultado em um layout coeso
     - Transição suave do formulário para os resultados
     - Refs: FR-006 a FR-011

================================================================================
FASE 11 — MELHORIA DO CV (WEB)
================================================================================

11.1 [not implemented] Criar botão "Melhorar meu CV" visível após resultados
     - Estado de loading durante geração
     - Refs: FR-012

11.2 [not implemented] Implementar chamada à API /improve
     - Enviar arquivo do currículo original, job description e resultado da análise via multipart/form-data
     - Refs: FR-001, FR-012

11.3 [not implemented] Criar componente de exibição do CV melhorado
     - Texto formatado e legível do CV gerado
     - Resumo das mudanças realizadas (changes summary)
     - Refs: FR-012, BR-007

11.4 [not implemented] Criar componente de comparação de scores
     - Score original vs score melhorado lado a lado
     - Indicador de delta (ex: "+25 pontos")
     - Refs: FR-013

11.5 [not implemented] Criar botão de download do CV melhorado
     - Download em formato texto (plain text)
     - Nome do arquivo: "cv-melhorado-[data].txt"
     - Refs: FR-014

================================================================================
FASE 12 — RESPONSIVIDADE E POLISH (WEB)
================================================================================

12.1 [not implemented] Garantir responsividade mobile-first em todos os componentes
     - Testar layout de 320px até desktop
     - Refs: NFR-008

12.2 [not implemented] Revisar todos os textos da interface em pt-BR
     - Verificar placeholders, labels, mensagens de erro, tooltips
     - Refs: NFR-006

12.3 [not implemented] Adicionar estados de loading, erro e vazio em todas as interações
     - Feedback visual para cada ação do usuário

12.4 [not implemented] Revisar acessibilidade (labels, contraste, navegação por teclado)

================================================================================
FASE 13 — TESTES DO FRONTEND
================================================================================

13.1 [not implemented] Configurar framework de testes no app web (Vitest + Testing Library)

13.2 [not implemented] Escrever testes para componentes do formulário
     - Upload, input de API key, seleção de provider, textarea

13.3 [not implemented] Escrever testes para componentes de resultado
     - Score, strengths/weaknesses, keywords, breakdown, warnings

13.4 [not implemented] Escrever testes para fluxo de melhoria de CV
     - Botão melhorar, comparação de scores, download

================================================================================
FASE 14 — DEPLOY E FINALIZAÇÃO
================================================================================

14.1 [not implemented] Configurar deploy da API no Cloudflare Workers
     - Revisar wrangler.jsonc, configurar domínio/rota
     - Refs: NFR-007

14.2 [not implemented] Configurar deploy do frontend (Vercel ou Cloudflare Pages)
     - Build de produção, variáveis de ambiente

14.3 [not implemented] Configurar CI/CD pipeline
     - Lint, type-check e testes em PRs
     - Deploy automático na branch main

14.4 [not implemented] Revisão final de segurança
     - Confirmar que nenhum dado é persistido (BR-001)
     - Confirmar que API keys não são logadas (BR-002)
     - Confirmar que não há localStorage/sessionStorage/cookies com dados do usuário

14.5 [not implemented] Atualizar README com instruções de uso e contribuição

================================================================================
RESUMO DE PROGRESSO
================================================================================

Fase  1 — Setup & Infraestrutura API     : 5/5  tarefas concluídas
Fase  2 — Schemas e Validação (API)       : 4/4  tarefas concluídas
Fase  3 — Prompts de IA (API)             : 3/3  tarefas concluídas
Fase  4 — Serviço de Providers (API)      : 2/2  tarefas concluídas
Fase  5 — Endpoints da API                : 3/3  tarefas concluídas
Fase  6 — Parsing de Arquivos (API)       : 4/4  tarefas concluídas  (6.1 e 6.4 absorvidas por 2.1)
Fase  7 — Testes da API                   : 5/5  tarefas concluídas
Fase  8 — Setup do Frontend               : 2/2  tarefas concluídas
Fase  9 — Formulário de Análise (Web)     : 6/6  tarefas concluídas
Fase 10 — Exibição de Resultados (Web)    : 6/7  tarefas concluídas
Fase 11 — Melhoria do CV (Web)            : 0/5  tarefas concluídas
Fase 12 — Responsividade e Polish (Web)   : 0/4  tarefas concluídas
Fase 13 — Testes do Frontend              : 0/4  tarefas concluídas
Fase 14 — Deploy e Finalização            : 0/5  tarefas concluídas
--------------------------------------------------------------------------
TOTAL                                     : 39/59 tarefas concluídas
