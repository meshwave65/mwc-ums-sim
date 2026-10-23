# Plano de validação robusta — MWC / UMS

## Objetivo

Separar evidência de funcionamento do código, consistência interna do modelo econômico, comportamento estatístico e viabilidade operacional/econômica. Nenhuma dessas camadas, isoladamente, prova as demais.

## Nível 1 — Regressão e reprodutibilidade

**Evidência existente:** suíte Vitest cobre estado inicial, seed determinística, fixture após 10 rodadas, evolução de rodada, cadeia observadora e fila local de sincronização; CI executa build e testes.

**Ampliação adicionada:** `tests/robustness.test.ts` verifica invariantes contábeis em múltiplas seeds, cenário sem demanda, cenário de estresse e integridade da cadeia em diferentes comprimentos. O resultado da CI do commit que introduziu a suíte deve ser consultado antes de classificar essa ampliação como aprovada.

## Nível 2 — Invariantes e testes de fronteira

Critérios a manter automatizados:
- nenhum saldo UMS, contador de geração/uso/rejeição ou quantidade de MWC pode ser negativo ou não finito;
- totais agregados devem corresponder à soma dos valores individuais;
- MWC disponível deve corresponder a MWC gerado menos MWC reconvertido;
- demanda zero não deve gerar execução, uso ou serviços não atendidos;
- a cadeia deve detectar alteração de payload, hash anterior, sequência e remoção de bloco;
- a mesma configuração e seed devem produzir a mesma projeção econômica, desconsiderando campos temporais/ambientais que não fazem parte dessa projeção.

Os testes de fronteira não substituem revisão das regras contábeis. Se uma invariável falhar, registrar primeiro a reprodução e o comportamento observado; só então alterar o motor.

## Nível 3 — Experimentos estatísticos

Executar lotes de seeds fixas e publicadas, variando um parâmetro por vez:
- faixa de perfil de geração;
- taxa de validação PoUW;
- saldo inicial;
- custos e demanda dos serviços;
- limiar e tamanho do bloco de conversão;
- razão entre demanda e capacidade agregada.

Para cada cenário, registrar: configuração completa, seeds, rodadas, serviços solicitados/executados/não atendidos, UMS geradas/usadas/rejeitadas, MWC criado/reconvertido/disponível, BRL contábil, usuários em déficit, tempo de execução e versão/commit do código. Publicar distribuição, mediana, percentis e extremos; não escolher somente uma execução favorável.

Os resultados são propriedades do modelo e dos parâmetros simulados, não previsões do mundo real. Limites aceitáveis devem ser definidos antes da execução dos experimentos, evitando ajustar os critérios após ver os resultados.

## Nível 4 — Persistência e operação integrada

Os testes atuais da fila IndexedDB usam um repositório remoto simulado (mock). Eles verificam a lógica da fila, não a integração real com Supabase.

Antes de afirmar persistência remota validada, testar em ambiente controlado:
- gravação e leitura de metadados, blocos, transações e snapshots;
- políticas RLS para usuário autorizado e não autorizado;
- interrupção de rede, recuperação, retries e idempotência;
- duplicação, concorrência, reinício/refresh e recuperação de locks;
- consistência entre o estado local e o estado remoto após sincronização;
- logs e evidência reproduzível de cada resultado.

Usar projeto e credenciais de teste, sem dados reais ou segredos em logs.

## Nível 5 — Validação econômica e externa

O simulador documenta PoUW como taxa didática, preço de MWC como referência contábil e ausência de uma exchange/mercado real. Portanto, os testes de software não validam:
- trabalho útil verificável ou resistência a fraude;
- consenso e operação distribuída entre nós independentes;
- preço, liquidez, formação de mercado ou conversibilidade em BRL;
- incentivos sustentáveis, custos de infraestrutura ou viabilidade econômica;
- procura real de usuários ou parceiros.

Essas questões exigem especificação econômica explícita, dados operacionais representativos, comparação com alternativas e pilotos com participantes externos. Não apresentar BRL contábil como dinheiro, receita, preço de mercado ou liquidez real.

## Estado e evidências

- Testes históricos e workflow de CI: consultar os links no repositório e o histórico de Actions.
- Nova suíte de robustez: `tests/robustness.test.ts`; CI aprovada no run https://github.com/meshwave65/mwc-ums-sim/actions/runs/39876083822.
- Matriz exploratória: `tests/economic-experiments.test.ts`, 50 execuções em cinco cenários, dez seeds pareadas e 40 rodadas por execução; CI aprovada no run https://github.com/meshwave65/mwc-ums-sim/actions/runs/39876476644. O resumo quantitativo é impresso no log de teste; aprovação do teste não equivale a validação de premissas reais.
- Contrato do adaptador Supabase com cliente simulado: `tests/supabase-repository.test.ts`; CI aprovada no run https://github.com/meshwave65/mwc-ums-sim/actions/runs/39876539563. Não é teste contra Supabase remoto.
- Análise dos limites do PoUW: `docs/ANALISE_TECNICA_POUW.md`.
- Protocolo para validação externa: `docs/PROTOCOLO_VALIDACAO_EXTERNA.md`; descreve pesquisa proposta, não entrevistas realizadas.
- Ainda pendentes: experimento contra projeto Supabase de teste com RLS real; extração/publicação dos valores quantitativos da matriz em relatório durável; especificação e teste de uma tarefa PoUW concreta; entrevistas/pilotos com participantes externos.


### Execução experimental adicionada

A suíte `tests/economic-experiments.test.ts` executa uma matriz exploratória pareada:
- 5 cenários: base, demanda a 150%, validação a 90%, saldo inicial de 1.000 UMS e limiar de conversão de 5.000 UMS;
- 10 seeds fixas por cenário;
- 40 rodadas por execução;
- 50 execuções no total, com as mesmas seeds reutilizadas entre cenários para permitir comparação pareada;
- distribuição por cenário com mínimo, percentil 10, mediana, percentil 90 e máximo para taxa de demanda não atendida, UMS geradas/usadas/rejeitadas, MWC gerado/reconvertido/disponível e usuários com demanda não atendida/saldo zero;
- invariantes contábeis verificadas em cada execução.

O teste imprime a linha `MWC_UMS_EXPERIMENT_SUMMARY=` no log da CI para facilitar a recuperação do resumo. Os valores são resultados do simulador sob parâmetros declarados, não previsões reais. Esta matriz é exploratória: não substitui análise de sensibilidade mais ampla, calibração com dados operacionais, intervalos de confiança adequados ou validação independente.

A execução da CI para o commit que adiciona a matriz deve terminar antes de os resultados serem classificados como aprovados. Se falhar, investigar a causa com base no log antes de modificar o motor ou afrouxar as asserções.
