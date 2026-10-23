## Design Concept
O cenário exige uma postura de revisão arquitetural técnica (fundindo o rigor de um seminário acadêmico/científico com a estética de engenharia de software). A âncora visual é o painel "MWBlockchain" combinado com o Design de Interface de IDEs (como o VS Code): tomamos do primeiro o fundo azul-marinho profundo com acentos luminosos (ciano, roxo, verde) e do segundo a tipografia monospace para identificadores e a organização em blocos lógicos. A paleta é fria, técnica e de alto contraste (dark-tech), rompendo a restrição acadêmica padrão para fundos claros devido à requisição explícita do usuário, mas mantendo a disciplina de ausência de decorações. O fundo será um azul-marinho quase preto, com superfícies ligeiramente mais claras para destacar diagramas estruturais. Fugimos do clichê "tela de terminal poluída", optando por um layout de grid limpo, onde a tipografia sem serifa geométrica conduz a leitura narrativa e a monoespaçada delimita estritamente o código e entidades de banco de dados.

## Visual Language
- **Imagery**: Nenhuma imagem decorativa. O espaço visual é inteiramente dedicado a diagramas arquiteturais construídos com CSS (blocos de texto, bordas e setas) e trechos de código estruturado.
- **Containers**: Baseado em cartões (card-based). Blocos lógicos (ex: Android Client, Supabase Auth, Postgres RLS) devem estar contidos em superfícies `#131B2F` com bordas finas `#1E293B`.
- **Icons**: Sólidos e estritamente funcionais (ícones de banco de dados, cadeado para segurança, nuvem para storage), usados apenas nos cabeçalhos dos cartões arquiteturais.
- **Dataviz**: Tabelas de metadados ou regras de segurança (RLS) com fundo transparente, linhas divisórias sutis (`#1E293B`) e cabeçalhos em monospace. Fluxos de dados usam os acentos semânticos: Ciano para Auth, Verde para Storage e Roxo para Segurança/RLS.
- **Motif**: Um rodapé fixo e minimalista em todas as páginas contendo o texto `MWC / UMS · Supabase integration` alinhado à esquerda, e uma fina linha de topo (2px) nos cartões principais utilizando a cor de destaque correspondente ao tema do slide.

## Layout Directives
- **Global**: Margens de 40px. Alinhamento rigorosamente à esquerda para textos. Rodapé com a nota de origem (esquerda) e número da página (direita) em texto mutado de 14px. Identificadores técnicos sempre em monospace no meio do texto.
- **Cover**: Título massivo, subtítulo contido, alinhamento inferior esquerdo, sem elementos visuais além de uma linha de destaque ciano.
- **Table of Contents**: Inexistente no outline, mas divisões de seção devem usar tipografia grande e monospace para indicar o módulo.
- **Section Dividers**: Cartão centralizado simulando uma interface de terminal limpa, com o nome do módulo (ex: `>_ auth_module_init`).
- **Closing**: Ecoa a capa, focando em "Critérios de Aceite" como um checklist técnico.
- **Slide map**:

| id | pattern | image | density |
|---|---|---|---|
| capa | Título grande à esquerda, rodapé técnico | none | low |
| ponto_partida | Duas colunas: estado atual vs. evidências | none | medium |
| arquitetura_alvo | Diagrama de blocos CSS (Client -> Auth/Postgres -> Storage) | none | high |
| fluxo_auth | Fluxo de passos sequenciais verticais em blocos | none | medium |
| fluxo_storage | Tabela de convenção de paths e metadados RLS | none | medium |
| organizacao_codigo | Layout de árvore de diretórios/módulos em monospace | none | high |
| seguranca_rls | Grade de políticas de segurança (tabela RLS) | none | high |
| plano_execucao | Checklist visual em fases (fase 1, 2, 3) | none | medium |

## Design Tokens

| token | hex | usage |
|---|---|---|
| bg-page | #0B1120 | Fundo principal da apresentação (azul-marinho profundo) |
| bg-surface | #131B2F | Fundo de cartões, blocos de código e diagramas |
| text-main | #F8FAFC | Texto principal, títulos e corpo |
| text-muted | #94A3B8 | Rodapés, legendas e textos secundários |
| border-subtle | #1E293B | Bordas de cartões e divisórias de tabelas |
| accent-cyan | #06B6D4 | Destaque para fluxos de Autenticação e links |
| accent-green | #10B981 | Destaque para Storage e caminhos determinísticos |
| accent-purple | #A855F7 | Destaque para regras RLS e fronteiras de segurança |

| role | family | size (px) | applies_to |
|---|---|---|---|
| display | Inter | 48 | Título da capa |
| heading | Inter | 32 | Títulos de slides |
| body | Inter | 20 | Textos descritivos e listas |
| code | JetBrains Mono | 18 | Identificadores de tabelas, funções, arquivos e paths |
| caption | Inter | 14 | Rodapé, número da página e notas de diagrama |

## Guardrails
- **Forbidden**: Fundo preto puro (`#000000`), imagens de banco de imagens abstratas (fios luminosos, cadeados 3D), gradientes nos textos ou fundos, alinhamento centralizado para parágrafos extensos.
- **Size floors**: body ≥18px, caption ≥14px, table/code ≥16px. Não reduzir a tipografia para caber mais texto; refatore o conteúdo em blocos visuais.
