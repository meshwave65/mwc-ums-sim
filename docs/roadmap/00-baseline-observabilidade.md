# Etapa 00 — Baseline, observabilidade e contrato de dados

**Status:** implementada parcialmente — baseline automatizada e contrato de contagens aprovados.

## Objetivo

Criar uma fotografia mensurável do simulador atual antes de qualquer otimização. Esta etapa não deve alterar a economia, o ciclo das rodadas ou a interface funcional.

## Escopo

- registrar tempo de uma rodada, 100 rodadas e 1.000 rodadas;
- medir tamanho do histórico e da cadeia observadora;
- registrar tempo de validação da MWBlockchain;
- formalizar quais campos são econômicos, operacionais e apenas visuais;
- documentar o contrato de eventos consumido pela blockchain;
- criar comandos de diagnóstico sem habilitá-los por padrão.

## Fora do escopo

- IndexedDB;
- Supabase;
- API externa;
- alteração de regras econômicas;
- alteração de formato persistido.

## Implementação sugerida

Adicionar um módulo de métricas puro, sem efeitos colaterais:

```ts
interface SimulationMetrics {
  rounds: number
  elapsedMs: number
  historyItems: number
  blockchainBlocks: number
  validationMs: number
}
```

As métricas devem ser coletadas somente em modo de desenvolvimento ou benchmark.

## Testes

- snapshot do estado inicial;
- execução determinística de uma rodada;
- execução de 100 rodadas;
- validação de uma cadeia válida;
- `pnpm build` e `git diff --check`.

## Critérios de aceite

- baseline salva em fixture ou relatório versionado;
- nenhuma diferença econômica em relação ao comportamento atual;
- execução normal não adiciona overhead perceptível;
- todas as métricas possuem unidade e definição documentadas.

## Riscos

O principal risco é medir no caminho crítico e alterar desempenho. Por isso, o módulo deve ser removível e ser ativado somente por configuração de desenvolvimento.

## Rollback

Remover o módulo de métricas e os comandos de diagnóstico. Nenhum dado de produção deve depender desta etapa.

## Gate

Só avançar quando houver uma baseline reproduzível para comparar todas as etapas seguintes.

## Resultado atual

A baseline automatizada está em `tests/baseline.test.ts` e os números observados estão registrados em `baseline-2026-10-07.md`. O teste cobre 1, 100 e 1.000 rodadas, mede simulação e validação, e confirma histórico e quantidade de blocos sem impor limites frágeis de ambiente.
