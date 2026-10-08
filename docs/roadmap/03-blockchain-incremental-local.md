# Etapa 03 — Blockchain incremental e persistência local

## Objetivo

Tirar a MWBlockchain do ciclo de renderização e fazer cada rodada gerar no máximo um bloco, com SHA-256 real e recuperação local.

## Escopo

- serviço observador incremental;
- canonicalização estável;
- SHA-256 real usando `crypto.subtle` no navegador ou módulo equivalente;
- persistência em IndexedDB;
- metadata com `lastBlockIndex` e `lastBlockHash`;
- validação ao iniciar a aplicação;
- proteção contra duplicação de rodada.

## Fluxo

```text
rodada termina
→ eventos são agregados
→ lê último bloco persistido
→ previous_hash = último hash
→ canonicaliza
→ calcula SHA-256
→ grava bloco e metadata
→ atualiza explorer
```

A gravação do bloco e da metadata deve ser atômica dentro da transação IndexedDB.

## Modelo mínimo

```ts
interface ChainMetadata {
  chainId: string
  version: string
  lastBlockIndex: number
  lastBlockHash: string
  machineAnchor: string
}
```

A Chain 0 e os blocos iniciais devem continuar derivados do estado real do simulador.

## Testes

- refresh recupera a cadeia;
- último hash persistido é usado como `previous_hash`;
- mesma rodada não gera bloco duplicado;
- corrupção local sobrevive a refresh;
- hash calculado e hash armazenado coincidem;
- Chain 0 não recria âncora em cada render;
- restauração local preserva o estado econômico.

## Critérios de aceite

- nenhum bloco é criado por re-render;
- validação identifica o primeiro bloco inválido;
- o simulador continua funcional offline;
- dados econômicos permanecem fora da blockchain;
- remoção do armazenamento local é explícita e reversível apenas por reconstrução.

## Riscos

IndexedDB ainda é armazenamento controlado pelo usuário e não é autoridade remota. Esta etapa é uma ponte, não a arquitetura final.

## Rollback

Desabilitar a persistência local e reconstruir a cadeia em memória a partir do estado atual. Manter o código de hash e validação coberto por testes.

## Gate

Só iniciar a API remota quando o contrato do bloco e a validação local estiverem estáveis.
