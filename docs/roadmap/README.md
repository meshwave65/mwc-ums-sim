# Roadmap de evolução do simulador e da MWBlockchain

Este diretório organiza a evolução do projeto da mudança menos intrusiva para a mais complexa. O princípio é preservar a economia existente, medir antes de otimizar e manter sempre um caminho de rollback.

## Ordem oficial

| Etapa | Objetivo | Impacto | Dependências |
|---|---|---:|---|
| 00 | Baseline, observabilidade e contrato de dados | Muito baixo | Nenhuma |
| 01 | Determinismo, fixtures e testes de regressão | Baixo | 00 |
| 02 | Histórico compacto e eventos desacoplados | Baixo | 01 |
| 03 | Blockchain incremental e persistência local | Médio | 01–02 |
| 04 | API independente de leitura e append | Médio | 03 |
| 05 | Supabase Postgres como persistência autoritativa | Médio/alto | 04 |
| 06 | Réplicas lógicas, auditoria e corrupção persistida | Alto | 05 |
| 07 | Frontend estático, CI e deploy Render | Médio/alto | 04–06 |
| 08 | Restauração, hardening e operação | Alto | 06–07 |

## Gates entre etapas

Uma etapa só deve ser considerada concluída quando:

- os testes existentes continuam passando;
- o estado econômico determinístico não mudou sem decisão explícita;
- há métricas comparáveis com a etapa anterior;
- o rollback foi testado ou documentado;
- a alteração está isolada em um pull request pequeno;
- a documentação e os critérios de aceite foram atualizados.

## Arquitetura-alvo

```text
mwc-ums-sim (frontend)
        │ HTTPS
        ▼
mwc-blockchain-service (API)
        │ transação
        ▼
Supabase Postgres
        ├── cadeia canônica
        ├── réplicas lógicas de validação
        └── auditoria
```

O frontend nunca será a autoridade para índice, `previous_hash`, timestamp, validador ou hash. A blockchain continua observacional: não cria saldos, usuários, serviços ou regras econômicas.

## Regras permanentes

1. SHA-256 é sempre escrito corretamente como **SHA-256**.
2. A canonicalização do bloco deve ser determinística.
3. O hash armazenado nunca é usado sem validação.
4. O estado econômico vem apenas do simulador.
5. Corrupção é uma operação de laboratório auditável e protegida.
6. Réplicas no mesmo banco são redundância lógica, não redundância física.
7. Segredos ficam no ambiente do serviço, nunca no frontend ou no Git.

## Como executar

Cada documento de etapa contém escopo, implementação, testes, critérios de aceite, riscos e rollback. A recomendação é implementar uma etapa por PR e parar no gate antes de iniciar a seguinte.
