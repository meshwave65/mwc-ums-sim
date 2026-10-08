# Etapa 08 — Restauração, hardening e operação

## Objetivo

Fechar o ciclo operacional: detectar falha, preservar evidência, restaurar uma cadeia confiável e manter o simulador independente da blockchain.

## Princípio

A blockchain não reconstrói a economia. A restauração deve usar:

- checkpoints do simulador;
- eventos econômicos versionados;
- cadeia observacional persistida;
- auditoria da operação.

## Fluxo de restauração

```text
detectar corrupção
→ congelar append da cadeia
→ registrar auditoria
→ escolher último checkpoint econômico íntegro
→ reconstruir Chain 0 e blocos iniciais
→ reprocessar eventos observacionais
→ recalcular SHA-256
→ recriar réplicas lógicas
→ validar cadeia
→ registrar restauração
→ liberar append
```

Se não houver checkpoint confiável, o sistema deve informar que a restauração automática não é segura, em vez de inventar saldos.

## Checkpoints

Um checkpoint deve conter:

- simulation id;
- seed;
- round;
- estado econômico;
- digest do estado;
- versão do simulador;
- timestamp;
- referência aos eventos incluídos.

Checkpoints podem ser armazenados no Postgres ou exportados para Storage, mas devem ter digest e política de retenção.

## Hardening

- autenticação dos endpoints de append;
- autorização separada para corrupção e restauração;
- idempotência;
- rate limiting;
- logs estruturados;
- alertas de divergência;
- migrations revisadas;
- backups testados por restauração, não apenas existentes;
- rotação de segredos;
- política para limpeza de dados de laboratório.

## Testes finais

- restart da API sem perda;
- falha simulada no meio da transação;
- restauração após payload alterado;
- restauração após bloco excluído;
- réplica divergente recuperada;
- replay determinístico a partir de checkpoint;
- frontend mostra estado offline sem confirmar bloco não persistido;
- backup exportado é verificável.

## Critérios de aceite

- existe runbook de incidente;
- restauração foi executada em ambiente de teste;
- o primeiro bloco inválido é identificável;
- a cadeia restaurada passa na validação;
- o estado econômico permanece separado e auditável;
- nenhuma operação destrutiva ocorre sem autorização administrativa.

## Rollback

Se a restauração falhar, manter a cadeia original marcada como corrompida, preservar auditoria e bloquear novas escritas. A equipe deve escolher manualmente o checkpoint antes de tentar novamente.

## Encerramento do roadmap

Após esta etapa, o sistema terá uma blockchain rudimentar, persistente e verificável, mas continuará sem consenso distribuído real. Essa distinção deve permanecer explícita na documentação e na interface.
