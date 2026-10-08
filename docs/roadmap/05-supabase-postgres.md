# Etapa 05 — Supabase Postgres como persistência autoritativa

## Objetivo

Substituir o armazenamento local autoritativo por Postgres gerenciado, usando transações, constraints e auditoria. Supabase Storage fica reservado para arquivos e exportações.

## Tabelas mínimas

- `blockchain_chains`;
- `blockchain_blocks`;
- `blockchain_heads`;
- `blockchain_integrity_audits`;
- `blockchain_corruption_events`.

`blockchain_blocks` deve ter unicidade por `(chain_id, block_index)`, hash e idempotency key. `blockchain_heads` é um ponteiro de recuperação rápida, não substitui a validação da cadeia.

## Transação de append

```text
BEGIN
→ bloquear a cabeça da cadeia
→ ler último bloco
→ verificar head contra último bloco
→ canonicalizar novo payload
→ calcular SHA-256
→ inserir bloco
→ atualizar blockchain_heads
→ COMMIT
```

Se qualquer passo falhar, nenhum bloco deve ficar parcialmente gravado.

## Segurança

- RLS e políticas para leitura pública controlada;
- service role key somente no webservice;
- credenciais em variáveis do Render;
- migrations versionadas;
- logs sem payload sensível;
- separação de roles de leitura, ingestão e administração.

## Storage

Usar Storage para:

- JSON de exportação;
- snapshots de auditoria;
- relatórios;
- dumps externos.

Não usar Storage como substituto de tabela transacional de blocos.

## Testes

- migration limpa e repetível;
- append transacional;
- rollback em falha entre insert e head;
- constraints rejeitam índice duplicado;
- leitura paginada retorna a ordem correta;
- validação compara `blockchain_heads` com a cadeia;
- RLS não permite escrita privilegiada pelo frontend.

## Critérios de aceite

- cadeia sobrevive ao restart do Render;
- duas requisições concorrentes não criam fork acidental;
- dados podem ser exportados para Storage;
- segredo do Supabase nunca aparece no frontend;
- backup e retenção estão documentados conforme o plano utilizado.

## Riscos

Banco gerenciado não é automaticamente redundância distribuída do projeto. Backups e disponibilidade devem ser distinguidos de réplicas lógicas.

## Rollback

Manter exportação da cadeia anterior e migration reversível. O modo local só pode ser usado para desenvolvimento, nunca como confirmação de append remoto.
