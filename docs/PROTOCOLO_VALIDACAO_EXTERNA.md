# Protocolo de validação externa — UMS/MWN

**Revisão:** 2026-10-29 — incluído gate de convergência mútua; os níveis E0–E5 continuam sendo estágios de evidência externa.

## Objetivo

Verificar se usuários e parceiros potenciais reconhecem um problema concreto que a proposta UMS/MWN poderia resolver, quais evidências exigiriam e sob quais condições aceitariam participar de um piloto. O protocolo não apresenta o simulador como rede operacional nem MWN como ativo negociável.

## Regras de abordagem

- Validar primeiro problema, utilidade e disposição para participar; não começar pedindo investimento.
- Separar opinião favorável, intenção declarada, compromisso de piloto e contratação efetiva.
- Não apresentar BRL de referência como dinheiro, preço de mercado, liquidez ou promessa de conversão.
- Não afirmar que PoUW real, consenso distribuído ou segurança operacional estejam implementados.
- Registrar objeções e respostas negativas com o mesmo cuidado que manifestações de interesse.
- Não divulgar dados pessoais de entrevistados sem consentimento.

## Gate de elegibilidade: convergência mútua

Antes de selecionar ou recomendar uma pessoa para abordagem, identificar uma hipótese verificável de valor nos dois sentidos. A pergunta principal da triagem é: **que utilidade concreta a capacidade ou hipótese atual de UMS/MWN poderia ter para um interesse, necessidade ou projeto atual deste contato?** A pergunta complementar é o que o contato, por sua vez, poderia ajudar a validar ou esclarecer no projeto.

Registrar para cada candidato:

1. **Agenda atual do contato:** iniciativa, projeto, pesquisa, produto, serviço ou problema atual, com evidência profissional pública e específica da pessoa; não basta cargo, setor, empregador ou competência genérica.
2. **Contribuição possível de UMS/MWN ao contato:** uso ou benefício potencial específico para aquela agenda, apoiado por capacidade existente ou hipótese claramente identificada no escopo e estágio documentados do projeto. Não apresentar proposta, simulador ou roadmap como serviço comprovado.
3. **Contribuição possível do contato ao projeto:** requisito, crítica, validação, cenário de uso ou outra contribuição específica, apoiada pela atividade atual da pessoa; não presumir disponibilidade, autoridade, recursos ou interesse.
4. **Interseção testável:** uma pergunta ou próximo passo exploratório que possa confirmar, corrigir ou rejeitar a hipótese bilateral.

Classificar o resultado da triagem separadamente da evidência de validação externa:

- `MUTUAL_FIT_ELIGIBLE`: há evidência atual e específica da agenda do contato, utilidade plausível para ele/ela, contribuição plausível para o projeto e uma pergunta exploratória delimitada. Permite recomendar uma conversa, não presume interesse ou aceite.
- `MUTUAL_FIT_UNCONFIRMED`: existe uma hipótese bilateral, mas falta evidência material ou confirmação do contato. Não recomendar abordagem até resolver a lacuna ou obter revisão humana.
- `ONE_WAY_PROJECT_FIT`: o contato parece poder ajudar o projeto, mas não foi identificada utilidade concreta do projeto para sua agenda atual. Não é elegível por este protocolo.
- `NO_CURRENT_FIT`: as fontes não demonstram uma interseção atual. Registrar a limitação, sem transformar ausência de evidência em juízo sobre a pessoa.

Se a pergunta “o que o projeto pode oferecer a este contato, especificamente?” não puder ser respondida sem especulação, interromper a triagem de abordagem, mesmo que a competência da pessoa pareça ideal para o projeto.

## Categorias de participantes potenciais

As categorias abaixo descrevem tipos de interlocutores, não critérios suficientes de seleção. Aplicar primeiro o gate de convergência mútua; não selecionar alguém apenas por pertencer a uma dessas categorias.

1. **Consumidores de serviços computacionais:** organizações com custos mensuráveis de processamento, armazenamento, banda, roteamento ou recuperação.
2. **Provedores de recursos:** operadores que possam quantificar capacidade ociosa, custo marginal, energia e disponibilidade.
3. **Parceiros técnicos:** especialistas em sistemas distribuídos, segurança, verificação de tarefas e mecanismos de incentivo.
4. **Especialistas econômicos/regulatórios:** para avaliar premissas de emissão, conversão, governança e enquadramento jurídico.

## Perguntas centrais

1. Qual problema operacional mensurável existe hoje e como é resolvido?
2. Qual é o custo atual, a frequência e o impacto do problema?
3. Que requisito mínimo tornaria uma alternativa testável?
4. O que precisa ser verificado antes de confiar no trabalho executado por terceiros?
5. Que custo de integração, risco e esforço de migração seriam aceitáveis?
6. Que dados e resultados precisariam aparecer num piloto?
7. A organização aceitaria participar de um piloto sem promessa de retorno financeiro? Em que condições?
8. Qual seria o próximo passo concreto e quem teria autoridade para autorizá-lo?
9. Qual projeto, objetivo ou necessidade profissional atual é prioritário para você, e que evidência sustentaria que uma capacidade ou hipótese específica de UMS/MWN poderia ser útil nesse contexto?
10. Que benefício concreto, se algum, você veria em explorar essa hipótese conosco; o que precisaria ser verdadeiro para que a conversa valesse seu tempo?

As perguntas 9–10 servem para confirmar ou corrigir uma hipótese baseada em evidências públicas, não para insinuar que já exista benefício, necessidade ou interesse.

## Evidência e classificação

- **E0 — Sem interesse:** não há problema relevante ou não deseja continuar.
- **E1 — Interesse exploratório:** conversa ou pedido de documentação, sem compromisso.
- **E2 — Problema quantificado:** fornece cenário, métricas ou requisitos concretos.
- **E3 — Compromisso de piloto:** indica responsável, escopo, critério de sucesso e janela de execução.
- **E4 — Piloto executado:** dados observados e resultados documentados.
- **E5 — Adoção/contrato:** decisão real de uso ou contratação.

E0–E5 medem o estágio da evidência de validação externa; não medem a elegibilidade ou a convergência mútua do candidato. Sem contato/resposta verificável, registrar `NOT_ASSESSED` (não classificar como E0). Não converter `MUTUAL_FIT_ELIGIBLE` em interesse confirmado: apenas o contato pode confirmar ou rejeitar o valor para sua agenda.

Não somar E1 como se fosse demanda contratada. Para avançar, buscar evidência em mais de uma organização independente e documentar resultados negativos.

## Critério mínimo para propor piloto

Um piloto só deve ser desenhado quando houver:
- um problema ou objetivo atual do participante identificado e uma hipótese explícita, não prometida, de utilidade de UMS/MWN para esse participante, além da contribuição esperada para a validação do projeto;
- tarefa concreta e legalmente autorizada;
- baseline mensurável da solução atual;
- critério de qualidade verificável;
- custo e risco operacional identificados;
- participante externo responsável;
- critérios de sucesso e interrupção acordados antecipadamente;
- plano de tratamento de dados e segurança.

## Estado

Este arquivo define um protocolo de pesquisa; não afirma que entrevistas, pilotos ou compromissos externos já tenham ocorrido. A execução exige contato real com participantes identificados e registro fiel das respostas.

## Referência metodológica

Aplicar este gate em conjunto com o [Protocolo de convergência mútua da MeshWave, v0.3.0](https://github.com/meshwave65/network/blob/main/docs/protocols/05_MUTUAL_CONVERGENCE_PROTOCOL.md). Este documento adapta a exigência bilateral à validação externa de UMS/MWN; não substitui a verificação da maturidade, dos limites e das evidências específicas do projeto.
