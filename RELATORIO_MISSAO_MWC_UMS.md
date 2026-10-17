# Relatório da missão — evolução MWC–UMS

## Estado inicial

O repositório `meshwave65/mwc-ums-sim` já continha um simulador funcional em Vite + React + TypeScript, com motor econômico puro, histórico de rodadas, eventos, conversão UMS/MWC, gráficos, relatório e um observador local da MWBlockchain. A cadeia era reconstruída em memória a partir do histórico e já tinha SHA-256 e validação de `previous_hash`.

Também existia uma camada parcial de sincronização: fila IndexedDB, processador com retry/backoff e adaptador de upsert para as quatro tabelas `mw_*`. Ela estava montada no `main.tsx`, mas não era alimentada pelo estado da simulação.

## Inspeção do Supabase

O projeto Supabase correspondente foi identificado como `ufylccbdjfzydbwhpmpp`. A inspeção somente leitura confirmou as tabelas existentes e vazias:

- `public.mw_chain_metadata`: chave primária `chain_id`.
- `public.mw_blocks`: unicidade em `(chain_id, block_hash)` e `(chain_id, block_number)`; FK para os metadados.
- `public.mw_transactions`: unicidade em `(chain_id, transaction_hash)`; FK opcional para bloco e FK para metadados.
- `public.mw_state_snapshots`: unicidade em `(chain_id, block_number)`; FK para metadados.

As quatro tabelas estão com RLS ativo e as políticas observadas permitem operações somente ao papel `authenticated`. Não foi criada migração, tabela paralela ou dado de teste. A configuração do SWE não estava disponível no workspace, portanto não foi inventado bucket, caminho, variável ou credencial.

## Arquivos alterados

- `src/persistence/sync/chainPersistence.ts`: novo mapeamento idempotente do estado real do simulador para metadados, blocos, transações e snapshots.
- `src/persistence/sync/runtime.ts`: expõe se a configuração pública do Supabase está disponível, sem expor segredos.
- `src/App.tsx`: enfileira a cadeia derivada sempre que o estado do simulador muda.
- `src/components/MWBlockchainPanel.tsx`: exibe `CHAIN_ID`, estado efetivo da fila e botão de sincronização; não apresenta sucesso remoto sem confirmação.
- `src/simulation/blockchain.ts`: mantém o `machine_anchor` estável entre recargas do mesmo navegador usando armazenamento local, evitando uma gênese diferente a cada inicialização.
- `src/persistence/sync/indexeddb.ts`: corrige recuperação de locks com idade zero (`<=`), eliminando uma regressão intermitente da fila.

## Funcionalidades reutilizadas

Foram preservados o motor `runRound`, os eventos e saldos produzidos pelo simulador, a construção e validação da MWBlockchain, o layout existente, a fila IndexedDB, o processador de retries e o adaptador Supabase já presente.

A cadeia usa o identificador estável `mwc-ums-simulator-v1`. Os IDs da fila são determinísticos por cadeia, bloco, transação e snapshot. Repetições fazem `put` na fila e usam as constraints `UNIQUE` existentes, sem criar operações econômicas duplicadas.

As transações não recebem remetente, destinatário ou valor artificialmente: o evento original só contém usuário, tipo, contagem e detalhes; essas informações ficam no `payload`, enquanto campos financeiros permanecem nulos.

## Testes executados

- Build de produção: **aprovado** (`tsc -b` + `vite build`).
- Suíte Vitest: **14 testes aprovados**.
- Regressão da fila: persistência entre instâncias, recuperação de locks, retry de falha de rede, classificação de RLS e exclusão após sucesso.
- Regressão econômica: motor, baseline de 1/100/1.000 rodadas e validação criptográfica da cadeia.
- Integridade: sequência, `previous_hash`, recálculo do hash e detecção de corrupção continuam cobertos.

Os cenários de navegador, reinicialização com leitura remota e falha de comunicação com o Supabase não foram declarados aprovados porque o frontend desta sessão não possui uma sessão autenticada nem uma configuração SWE reutilizável.

## Persistência e limitações atuais

A aplicação agora produz itens reais para sincronização, mas a persistência remota só deve ser considerada confirmada quando o Supabase responder positivamente. Com as variáveis públicas ausentes, o painel mostra `NÃO CONFIGURADA`. Mesmo com URL e chave pública, as políticas atuais exigem `authenticated`; o projeto ainda não contém autenticação do simulador nem uma API/Edge Function de menor privilégio para append atômico.

A gravação atual é uma fila de upserts independentes. Ela é idempotente e resiliente a falhas, mas ainda não é uma transação PostgreSQL única entre metadados, bloco, transações, snapshot e head. Não foi feita alteração de esquema para mascarar essa limitação.

A recuperação completa da cadeia a partir do Supabase após refresh permanece como próxima etapa: requer métodos de leitura paginada, validação do head remoto e hidratação do estado econômico somente a partir de snapshots efetivamente persistidos.

## Reversão

Para voltar ao estado anterior, reverta o commit desta missão. A alteração é localizada e não modifica o esquema ou apaga dados. Como nenhuma escrita remota de teste foi realizada, não há registros de teste para remover.

## Situação Git e implantação

O código foi validado localmente no sandbox. A implantação pública em Render não foi alterada nem declarada atualizada. A etapa de commit/push deve ocorrer somente após a revisão do bloqueio de autenticação/RLS e da estratégia de leitura/recuperação remota.

## Próxima etapa recomendada

Definir, junto à configuração do SWE, o mecanismo de autenticação e menor privilégio para o simulador. Em seguida, implementar uma função transacional no Postgres ou Edge Function para append atômico, métodos paginados de leitura e hidratação do estado após refresh. Só depois disso executar os testes B, D, E e F contra o ambiente autorizado e considerar a integração Supabase concluída.
