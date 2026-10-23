# Análise técnica do PoUW implementado no simulador MWC/UMS

## Escopo

Esta análise descreve o código do simulador na versão consultada em 23/10/2026. É uma leitura estática do motor, não uma auditoria independente nem uma execução de um mecanismo PoUW em rede real.

## Comportamento observado no motor

Em `src/simulation/engine.ts`, cada rodada:
1. calcula a demanda e o custo de serviços configurados;
2. distribui a demanda entre usuários com fatores aleatórios de alocação;
3. calcula `grossGenerated` a partir do uso de UMS e do perfil percentual da rodada;
4. aplica `validationRate`, limitado pelo código ao intervalo de 0,9 a 1, para calcular a quantidade reconhecida;
5. registra a diferença como UMS inválidas/rejeitadas;
6. atualiza saldos e totais do estado simulado.

A seed permite reproduzir a parte pseudoaleatória do cenário econômico. A taxa de validação é um parâmetro configurado, não uma avaliação de prova de trabalho útil observada por um verificador independente.

## O que isso demonstra

- O código implementa uma regra determinística sob seed e configuração para estimar geração reconhecida e rejeitada.
- Os testes podem verificar a aritmética, as invariantes e a sensibilidade dos resultados a parâmetros.
- O modelo pode ser usado para explorar hipóteses e encontrar cenários extremos dentro das regras codificadas.

## O que não demonstra

- que uma tarefa útil foi realmente executada;
- que o resultado da tarefa é correto, verificável ou relevante;
- resistência a conluio, replay, Sybil, duplicação de trabalho ou manipulação de telemetria;
- que o custo de verificar o trabalho é menor que o benefício;
- consenso ou validação por nós independentes;
- relação entre unidades simuladas, energia, custo operacional ou valor de mercado reais.

## Próximos requisitos para uma especificação PoUW testável

Antes de alterar o motor, especificar:
1. **Unidade de trabalho:** qual tarefa concreta é considerada útil e qual é a unidade mensurável.
2. **Prova verificável:** qual artefato/resultado prova a execução e como um verificador independente o valida.
3. **Critério de qualidade:** tolerância, resultado esperado, repetição ou amostragem de verificação.
4. **Identidade e unicidade:** como impedir que a mesma prova seja contabilizada várias vezes ou atribuída a identidades diferentes.
5. **Modelo de ameaça:** conluio, resultados fabricados, replay, indisponibilidade e falsificação de métricas.
6. **Custos:** recursos de execução, comunicação, armazenamento e verificação.
7. **Regra de recompensa:** fórmula explícita ligada ao trabalho aceito e penalidades para prova inválida.
8. **Testes adversariais:** entradas malformadas, provas repetidas, provas inválidas, resultados divergentes e verificadores em desacordo.

A próxima implementação só deve ocorrer depois de se escolher uma tarefa piloto e definir seus critérios de aceitação. Sem isso, transformar a taxa percentual atual em um mecanismo mais complexo seria apenas aumentar o código sem evidência de que o problema está definido.

## Conclusão

No estado consultado, PoUW é uma abstração parametrizada do simulador. A suíte de testes pode validar a consistência dessa abstração, mas não deve ser descrita como validação de PoUW real.
