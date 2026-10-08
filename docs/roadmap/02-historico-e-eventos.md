# Etapa 02 — Histórico compacto e eventos desacoplados

## Objetivo

Reduzir memória e renderizações sem perder o estado atual, a auditoria econômica ou os dados necessários para a cadeia.

## Escopo

Separar três responsabilidades:

- `simulationEvents`: eventos completos produzidos pelo motor;
- `uiEventLog`: janela curta para exibição;
- `history`: snapshots ou deltas destinados a gráficos e análises.

Adicionar modos de histórico:

```ts
type HistoryMode = 'full' | 'compact'
```

No modo compacto:

- limitar snapshots visuais;
- guardar checkpoints periódicos;
- armazenar deltas intermediários;
- preservar exportação completa quando solicitada.

## Regras de segurança

- o estado atual não pode depender do histórico visual;
- truncar o log visual não pode remover eventos enviados à blockchain;
- a compactação deve ser reversível enquanto os dados brutos estiverem disponíveis;
- o limite deve ser configurável e visível em modo diagnóstico.

## Testes

- histórico não excede o limite;
- estado final do modo compacto é igual ao modo completo;
- eventos econômicos continuam completos;
- painel mostra somente a janela configurada;
- gráficos continuam com os pontos de checkpoint esperados;
- 1.000 e 10.000 rodadas não geram crescimento ilimitado.

## Critérios de aceite

- redução mensurável de memória;
- nenhuma diferença nas fixtures econômicas;
- logs visual e econômico têm responsabilidades documentadas;
- rollback para `full` é uma configuração, não uma migração destrutiva.

## Riscos

Deltas incorretos podem produzir gráficos errados. A reconstrução de checkpoints deve ser testada com rodadas pequenas, médias e longas.

## Rollback

Desativar `compact` e voltar a snapshots completos. Não apagar os dados brutos até haver uma política de retenção validada.

## Gate

Somente avançar quando a cadeia puder consumir eventos completos sem depender do componente React.
