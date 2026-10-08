# Etapa 06 — Réplicas lógicas, auditoria e corrupção persistida

## Objetivo

Simular redundância e comportamento de adulteração sem alegar consenso ou alta disponibilidade reais.

## Modelo

Manter três cópias lógicas identificadas por:

```text
REPLICA-A
REPLICA-B
REPLICA-C
```

No primeiro modelo, todas ficam no mesmo Supabase Postgres. Isso permite testar divergência e maioria, mas não protege contra falha física do banco.

## Append das réplicas

Após inserir o bloco canônico na mesma transação:

- copiar índice e digest para A, B e C;
- registrar a origem e o timestamp;
- validar que os três hashes são iguais;
- registrar falha se uma cópia divergir.

A cadeia canônica deve ser definida separadamente das cópias de auditoria.

## Validação

Verificar:

1. Chain 0;
2. sequência de índices;
3. hash recalculado;
4. `previous_hash`;
5. metadata/head;
6. cada réplica;
7. primeiro bloco inconsistente;
8. quantidade de réplicas concordantes.

Estados sugeridos:

```text
VALID
CORRUPTED
DIVERGENT_REPLICA
TRUNCATED
METADATA_MISMATCH
MISSING_GENESIS
```

## Corrupção de laboratório

Tipos:

- `PAYLOAD_MUTATION`;
- `HASH_MUTATION`;
- `PREVIOUS_HASH_MUTATION`;
- `BLOCK_DELETION`;
- `TRUNCATION`;
- `REPLICA_DIVERGENCE`.

A operação deve preservar o hash antigo quando a intenção for simular adulteração de payload, registrar antes/depois e criar evento de auditoria.

## Proteções

- endpoint de corrupção não público por padrão;
- token administrativo separado;
- flag `LAB_MODE=true`;
- confirmação explícita na interface;
- bloqueio em produção, salvo override deliberado;
- toda operação é auditada.

## Testes

- corrupção sobrevive a restart;
- Chain 5 alterada invalida Chain 5 e dependentes;
- divergência apenas em A identifica B/C como maioria;
- truncamento é distinguido de corrupção interna;
- restauração não altera o histórico econômico;
- auditoria contém tipo, alvo, digest anterior e posterior.

## Critérios de aceite

- a corrupção não é apenas visual;
- o explorer consulta estado persistido;
- a validação informa o primeiro ponto de falha;
- a UI distingue cadeia canônica de réplica divergente;
- a documentação afirma claramente que réplicas são lógicas.

## Rollback

Desativar endpoints de laboratório e marcar dados corrompidos como experimento. Nunca apagar a auditoria da corrupção para esconder o evento.
