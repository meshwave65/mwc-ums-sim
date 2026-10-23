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
- Nova suíte de robustez: `tests/robustness.test.ts`; aprovação depende do resultado do workflow associado ao commit correspondente.
- Testes de integração remota, experimento estatístico amplo e validação externa: não declarados como concluídos por este documento.
