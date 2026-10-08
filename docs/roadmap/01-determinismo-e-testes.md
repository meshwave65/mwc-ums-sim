# Etapa 01 — Determinismo, fixtures e testes de regressão

**Status:** implementada — testes iniciais e CI adicionados.

## Objetivo

Garantir que otimizações estruturais não alterem os resultados econômicos quando a entrada e a `seed` forem iguais.

## Escopo

- introduzir uma `seed` explícita na configuração, se ainda não existir;
- fixar relógio nos testes;
- criar fixtures de estado inicial, rodada 1 e rodada 10;
- adicionar testes unitários para `createInitialState` e `runRound`;
- adicionar golden tests para UMS, BRL, MWC, eventos e totais;
- configurar Vitest e workflow de CI.

## Contrato de determinismo

Para uma mesma configuração:

```text
seed + estado inicial + número de rodadas
→ mesmo estado econômico e mesmos eventos
```

Timestamps e âncoras de máquina não devem ser comparados por igualdade quando forem deliberadamente externos à economia. Nesses casos, testar formato e presença.

## Casos mínimos

- 10 usuários, 10.000 UMS e R$ 0,00 no início;
- rodada incrementa exatamente uma unidade;
- nenhum saldo indevidamente negativo;
- mesma `seed` produz os mesmos totais;
- histórico completo e modo compacto produzem o mesmo estado final;
- alteração de regra econômica exige atualização explícita de fixture.

## Critérios de aceite

- `pnpm test -- --run` passa localmente e no GitHub Actions;
- fixtures ficam em `tests/fixtures/`;
- uma diferença econômica causa falha clara;
- o workflow inclui type-check e build;
- a documentação registra como atualizar fixtures após mudança intencional.

## Riscos

Fixtures podem congelar acidentalmente um bug. Toda atualização deve mostrar o diff econômico e explicar a razão no PR.

## Rollback

Os testes podem ser mantidos mesmo que a implementação da `seed` seja revertida. Se necessário, reverter apenas o mecanismo de geração determinística, preservando os testes de invariantes.

## Gate

Não compactar histórico nem desacoplar eventos antes de haver uma referência econômica confiável.

## Resultado atual

Foram adicionados `tests/engine.test.ts`, `tests/blockchain.test.ts`, `tests/helpers.ts` e a fixture `tests/fixtures/expected-round-10.json`. O workflow `.github/workflows/ci.yml` executa instalação congelada, build e regressões em pushes para `main`/`develop` e pull requests.
