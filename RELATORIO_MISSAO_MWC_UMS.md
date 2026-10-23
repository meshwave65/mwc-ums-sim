# Relatório da missão — evolução MWC/UMS e Storage Node

## 1. Estado atual

O repositório `meshwave65/mwc-ums-sim` contém um simulador educacional em Vite + React + TypeScript para observar a economia simplificada MWC/UMS: serviços em UMS, validação PoUW didática, geração de capacidade, conversão em MWC, mercado externo contábil e reconversão em UMS.

A aplicação principal possui motor econômico determinístico por seed, histórico de rodadas, eventos, usuários, mercado, gráficos, relatório final, parâmetros configuráveis e um observador local da MWBlockchain. A cadeia é reconstruída a partir do estado da simulação, usa SHA-256, mantém uma âncora estável no navegador e valida `previous_hash`, payload, sequência e integridade dos blocos.

Desde o relatório anterior, o projeto evoluiu em três frentes:

1. ampliação da suíte de testes de invariantes, robustez e experimentos econômicos;
2. criação do protótipo independente `public/storage-node.html`;
3. integração autenticada do Storage Node com Supabase Storage e uma tabela de metadados compartilhados.

O Storage Node é acessível pelo botão `STORAGE-NODE` no topo do simulador e também diretamente pela rota estática `/storage-node.html`.

## 2. Inspeção e contrato Supabase

O projeto Supabase utilizado é `ufylccbdjfzydbwhpmpp`. A integração do simulador continua usando somente cliente público no frontend, com `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` ou `VITE_SUPABASE_ANON_KEY`. Nenhuma `service_role` deve ser usada no navegador ou commitada no repositório.

O contrato anterior da blockchain permanece:

- `public.mw_chain_metadata`, com chave primária `chain_id`;
- `public.mw_blocks`, com unicidade por cadeia e número/hash do bloco;
- `public.mw_transactions`, com unicidade por cadeia e hash de transação;
- `public.mw_state_snapshots`, com unicidade por cadeia e número do bloco.

Essas tabelas continuam protegidas por RLS e a persistência do simulador exige sessão `authenticated`.

### 2.1. Novo contrato Storage Node

A migration `supabase/migrations/20261022000000_create_mwc_storage_v0.sql` adiciona:

- `public.mwc_storage_objects`;
- `id` UUID como chave primária;
- `owner_id` referenciando `auth.users(id)`;
- `node_id` UUID;
- `object_hash` SHA-256 em hexadecimal com 64 caracteres;
- `storage_path`, `original_name`, `content_type`, `size_bytes` e `created_at`;
- unicidade em `(node_id, object_hash)` e em `storage_path`;
- índice por hash e por proprietário/data.

A migration cria o bucket privado `mwc-storage-objects`, com limite de 20 MiB por objeto, e adiciona policies para usuários autenticados. A policy de metadados permite leitura autenticada compartilhada e inserção somente quando `owner_id = auth.uid()`.

O Storage Node usa caminhos determinísticos no formato:

```text
{owner_id}/{node_id}/{object_hash}
```

O objeto é identificado pelo hash do conteúdo, e não pelo nome original do arquivo.

## 3. Funcionalidades implementadas

### 3.1. Simulador principal

- `src/simulation/engine.ts`: execução pura das rodadas, saldos, serviços, validação e conversões.
- `src/simulation/defaults.ts`: configuração inicial, usuários, serviços, demanda, custos e seed.
- `src/simulation/blockchain.ts`: construção e validação da cadeia observadora.
- `src/persistence/sync/`: fila IndexedDB, retries/backoff, locks, classificação de falhas e mapeamento idempotente para as tabelas `mw_*`.
- `src/persistence/auth/SupabaseAuthProvider.tsx`: login e sessão persistente compatíveis com o fluxo do `AppAndroidSWE-Start`.
- `src/persistence/sync/supabase.ts`: upserts remotos e upload idempotente de snapshots para `sofia_storage_user`.
- `src/components/MWBlockchainPanel.tsx`: exibição de sessão, estado efetivo da fila, autenticação e sincronização.
- `src/components/HeaderStatus.tsx`: botão de acesso ao Storage Node.

A cadeia usa o identificador estável `mwc-ums-simulator-v1`. Os IDs da fila são determinísticos por cadeia, bloco, transação e snapshot. Repetições usam `upsert` e as constraints existentes, sem criar operações econômicas duplicadas.

### 3.2. Storage Node V0

A página `public/storage-node.html` é um protótipo estático independente com as seguintes capacidades:

- configuração local de capacidade elegível, percentual cedido e limite absoluto;
- cálculo visual da reserva configurada em GB;
- pausa e retomada do nó local;
- armazenamento de arquivos de teste em IndexedDB;
- cálculo de SHA-256 com `crypto.subtle.digest`;
- verificação local de integridade byte a byte;
- histórico local de períodos/configurações;
- gráfico de espaço reservado por configuração;
- placeholder explícito para UMS confirmadas, sem emitir créditos simulados;
- login e logout via Supabase Auth;
- listagem autenticada de metadados compartilhados;
- upload de objetos locais ao bucket `mwc-storage-objects`;
- registro de metadados em `mwc_storage_objects`;
- verificação remota imediata após upload, comparando tamanho e SHA-256;
- revalidação de objetos já existentes antes de evitar novo upload;
- download de objetos remotos com nova verificação de tamanho e hash;
- estados explícitos `VERIFIED` e `FAILED` na interface.

A sincronização usa `upsert: false` para objetos novos e a chave `(node_id, object_hash)` para reconhecer um objeto já registrado no mesmo nó. O fluxo não considera um upload concluído antes de baixar o objeto novamente e conferir seu tamanho e digest.

## 4. Modelo de confiança e limitações do Storage Node

O Storage Node é um protótipo de armazenamento e verificação, não uma rede distribuída de nós nem um mecanismo de emissão econômica. O texto da própria página informa que:

- os objetos continuam disponíveis localmente quando offline;
- a capacidade total do disco não é detectada automaticamente;
- UMS reais não são emitidas;
- PoUW, blockchain distribuída e créditos confirmados ainda não estão conectados a essa tela;
- a existência de um hash local não prova disponibilidade em outro nó.

A página contém apenas valores de cliente públicos para conexão ao Supabase. O usuário entra com sua própria conta; não há segredo administrativo no frontend.

A policy V0 de leitura compartilhada (`using (true)` para usuários autenticados) e a policy de leitura do bucket permitem o modelo de rede compartilhada do protótipo, mas devem ser revisadas antes de produção. Uma próxima versão deve decidir explicitamente se objetos serão públicos entre participantes, privados por proprietário ou acessíveis por autorização de projeto. Também deve restringir melhor os prefixos de Storage, em vez de confiar apenas na convenção do caminho.

## 5. Testes e evidências atuais

### 5.1. Suíte automatizada

Execução local realizada no commit atual:

```text
7 arquivos de teste aprovados
28 testes aprovados
pnpm build aprovado
```

Arquivos e cobertura principal:

- `tests/engine.test.ts` — contrato inicial, seed determinística, fixture econômica após 10 rodadas e evolução de rodada;
- `tests/blockchain.test.ts` — gênese, usuários, exchange, blocos por rodada, corrupção de payload e validação criptográfica;
- `tests/sync-queue.test.ts` — persistência IndexedDB entre instâncias, locks abandonados, sucesso, retry, RLS permanente e flush concorrente;
- `tests/baseline.test.ts` — baseline de 1, 100 e 1.000 rodadas, histórico e quantidade de blocos;
- `tests/robustness.test.ts` — nove testes de invariantes econômicas e da cadeia em cinco seeds, demanda zero, saldo inicial baixo, validação reduzida, comprimentos variados, remoção de bloco e quebra de hash anterior;
- `tests/economic-experiments.test.ts` — uma matriz exploratória com 50 execuções pareadas;
- `tests/supabase-repository.test.ts` — quatro testes do contrato do adaptador Supabase, incluindo mapeamento, upsert, upload de snapshot, propagação de falha do Storage e rejeição de payload inválido.

### 5.2. Matriz econômica exploratória

A matriz de `tests/economic-experiments.test.ts` executa:

- 5 cenários: baseline, demanda a 150%, validação a 90%, saldo inicial de 1.000 UMS e limiar de conversão de 5.000 UMS;
- 10 seeds fixas pareadas por cenário;
- 40 rodadas por execução;
- 50 execuções no total;
- distribuição por cenário com mínimo, P10, mediana, P90 e máximo;
- invariantes contábeis verificadas em todas as execuções.

No resultado local atual, por exemplo, o cenário `validation_90pct` apresentou taxa de demanda não atendida entre aproximadamente 10,7% e 17,6%, enquanto o cenário de saldo inicial baixo apresentou entre aproximadamente 61,6% e 73,7%. Esses números são propriedades do modelo sob os parâmetros configurados; não são previsões de mercado, métricas de uma rede real ou evidência de viabilidade econômica.

### 5.3. Verificações de build e página

- `pnpm test:run`: aprovado com 28 testes.
- `pnpm build`: aprovado com `tsc -b` e `vite build`.
- `public/storage-node.html`: arquivo presente e servido como página estática.
- Integração do botão `STORAGE-NODE` no topo do simulador confirmada.
- Código do Storage Node contém cálculo local e remoto de SHA-256, consulta autenticada, upload, revalidação e download.

## 6. O que ainda não está validado

A suíte `tests/supabase-repository.test.ts` usa cliente simulado. Ela valida o contrato do adaptador, mas não substitui um teste contra o projeto Supabase remoto.

Ainda não deve ser declarado como concluído:

- um ciclo completo de login com usuário autorizado no navegador real;
- upload, registro de metadados, download e revalidação contra o bucket remoto em ambiente controlado;
- teste de usuário não autorizado e confirmação das policies RLS em todas as operações;
- teste de concorrência entre dois nós reais usando o mesmo hash;
- recuperação após falha entre upload do objeto e inserção dos metadados;
- recuperação após falha entre inserção dos metadados e upload do objeto;
- leitura paginada e hidratação do estado econômico principal a partir do Supabase;
- atomicidade entre Postgres e Storage;
- detecção automática de capacidade de disco;
- emissão ou validação real de UMS por PoUW;
- consenso, réplica, disponibilidade ou tolerância a falhas de uma rede distribuída;
- validação econômica, regulatória, de mercado ou com participantes externos.

O Storage Node grava primeiro o objeto e depois os metadados em operações remotas separadas. Se uma etapa falhar, pode haver estado parcial. O código remove o objeto quando a verificação pós-upload ou a inserção dos metadados falha, mas esse comportamento ainda precisa ser exercitado contra o ambiente real e analisado para casos de timeout ou resposta ambígua.

## 7. Reversão e implantação

A evolução está publicada no branch `main` do repositório `meshwave65/mwc-ums-sim`. O build usa `render.yaml` para implantação estática a partir do branch principal, e a página Storage Node é um arquivo público independente dentro de `public/`.

Para reverter apenas a evolução do Storage Node, deve-se reverter os commits dessa funcionalidade em conjunto, incluindo a página, o botão no topo, a migration e as alterações de documentação. A reversão não deve apagar manualmente objetos ou metadados remotos sem uma operação de limpeza previamente autorizada.

## 8. Próximos passos recomendados

1. Executar a matriz I-01 a I-10 do `docs/ROTEIRO_INTEGRACAO_SUPABASE.md` em um projeto Supabase de teste, com identidades autorizada e não autorizada.
2. Registrar evidências de cada operação sem salvar tokens, senhas ou dados pessoais nos logs.
3. Reforçar policies de Storage para limitar prefixos por `auth.uid()` e decidir formalmente o modelo de compartilhamento.
4. Definir reconciliação para estados parciais entre objeto e metadados.
5. Implementar leitura paginada e recuperação do simulador principal após refresh.
6. Considerar uma Edge Function ou RPC transacional para coordenar metadados, snapshots e head da cadeia.
7. Separar explicitamente resultados de software, resultados econômicos do modelo, teste de PoUW e validação externa.
8. Só considerar UMS/MWC operacional após tarefa PoUW concreta, critérios de validação, observabilidade e piloto externo documentados.
