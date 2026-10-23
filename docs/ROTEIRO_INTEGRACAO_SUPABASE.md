# Roteiro para integração real com Supabase — MWC/UMS

## Objetivo e limites

Este roteiro orienta um teste manual controlado da integração real. Não é evidência de que o teste já foi executado. A suíte `tests/supabase-repository.test.ts` usa um cliente simulado e só cobre o contrato do adaptador.

## Pré-condições

1. Usar um projeto Supabase de teste separado de qualquer ambiente produtivo.
2. Confirmar no painel que existem as tabelas `mw_chain_metadata`, `mw_blocks`, `mw_transactions`, `mw_state_snapshots` e o bucket `sofia_storage_user`.
3. Revisar os esquemas reais, chaves únicas usadas por `onConflict` e políticas RLS. O repositório consultado não contém migrations SQL que comprovem a estrutura implantada.
4. Usar somente a publishable/anon key no frontend. Nunca colocar `service_role` no navegador, em testes client-side ou em commits.
5. Preparar uma identidade de teste autorizada e outra não autorizada, quando a política do projeto permitir esse teste.
6. Registrar projeto/ambiente, versão do esquema e horário do teste sem incluir tokens ou dados pessoais nos logs.

## Matriz de execução

| Caso | Operação | Resultado esperado |
|---|---|---|
| I-01 | Gravar metadados de uma cadeia de teste | Uma linha recuperável com os campos mapeados |
| I-02 | Repetir a mesma gravação de metadados | Upsert idempotente pela chave `chain_id`, sem duplicação |
| I-03 | Gravar bloco e repetir o mesmo bloco | Uma linha por `chain_id, block_number` |
| I-04 | Gravar transação e repetir o mesmo identificador | Uma linha por `chain_id, transaction_hash` |
| I-05 | Gravar snapshot | Linha em `mw_state_snapshots` e JSON em `sofia_storage_user/mwc-ums/{chainId}/snapshots/{blockNumber}.json` |
| I-06 | Negar permissão à identidade não autorizada | Operação rejeitada; erro e estado da fila registrados corretamente |
| I-07 | Interromper rede após enfileirar | Item permanece pendente e é retomado após reconexão |
| I-08 | Simular resposta de erro após tentativa de escrita e reenviar | Sem duplicação de dados; confirmar a semântica real de upsert |
| I-09 | Gravar snapshot sem permissão no Storage | Erro explícito; verificar também se a linha de snapshot já foi gravada na tabela |
| I-10 | Ler de volta os dados e comparar com os payloads | Campos críticos e hashes correspondem ao esperado |

## Atenção: atomicidade do snapshot

O código atual grava primeiro em `mw_state_snapshots` e depois envia o JSON ao Storage. Essas são duas operações remotas distintas. Se o upload falhar, a linha da tabela pode já existir. O teste I-09 deve registrar esse estado parcial; não presumir transação atômica entre Postgres e Storage.

## Critério de aprovação

Só classificar como integração remota aprovada quando:
- cada caso tiver evidência observável e resultado registrado;
- RLS tiver sido exercida com identidades autorizada e não autorizada;
- repetição e recuperação não criarem duplicatas;
- inconsistências parciais forem compreendidas e tratadas;
- nenhuma credencial privilegiada tiver sido exposta.

Se o esquema, as chaves únicas ou as políticas RLS não corresponderem ao contrato do adaptador, parar a classificação como aprovada e registrar a divergência antes de alterar código ou banco.
