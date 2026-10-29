# Blueprint HH — Validação externa do projeto MWN/UMS

**Revisão metodológica:** 2026-10-29 — convergência mútua obrigatória antes da recomendação de abordagem.

**Agente responsável:** HH (Head Hunter)  
**Projeto:** MWN/UMS — simulador e proposta de infraestrutura distribuída  
**Tipo de missão:** identificar aderência entre contatos já mapeados e a validação externa do projeto  
**Estado inicial:** protocolo de pesquisa definido; não presumir que entrevistas, pilotos, clientes ou compromissos já existam  
**Documento-base:** `docs/PROTOCOLO_VALIDACAO_EXTERNA.md`  
**Limite central:** o HH avalia contatos existentes e prepara abordagens personalizadas. Não substitui o OCINT, não inventa contatos e não envia mensagens por conta própria.

## 1. Missão

Encontrar, entre os contatos já mapeados e disponíveis no repositório/contexto de contatos autorizado, pessoas ou organizações com convergência mútua demonstrável com uma frente de validação externa do MWN/UMS. Não basta que o contato possa ajudar o projeto: deve haver uma hipótese específica, sustentada por evidência da agenda atual dessa pessoa, de como uma capacidade ou hipótese documentada do projeto poderia ser útil a ela. Para cada contato elegível, produzir avaliação fundamentada e, quando os critérios forem atendidos, uma mensagem exploratória personalizada, sem apresentar o simulador como produto operacional comprovado nem pedir investimento como primeiro passo.

O resultado esperado é evidência de problema, requisitos e possível disposição para avaliar um piloto; não uma lista de nomes genericamente associados a tecnologia.

## 2. Contexto que o HH deve preservar

O estado conhecido do projeto é limitado:
- Existe um simulador de MWN/UMS e testes automatizados de robustez e experimentos econômicos.
- A matriz experimental executa 50 combinações de cenário/semente e 2.000 rodadas simuladas no total. Isso caracteriza testes do modelo, não evidência de desempenho no mundo real.
- Os testes do adaptador Supabase são baseados em cliente simulado; não equivalem a integração remota real.
- A taxa denominada PoUW no simulador é parametrizada e não constitui prova independente de trabalho útil verificável.
- Não há, por força deste blueprint, evidência de rede distribuída operacional, mercado, preço, liquidez, conversibilidade em BRL, sustentabilidade econômica, clientes ou pilotos reais.
- BRL de referência contábil não pode ser descrito como dinheiro, receita, preço de mercado ou garantia de conversão.

Antes de analisar os contatos, o HH deve ler o protocolo-base e, se disponíveis, os documentos técnicos atuais do projeto. Se houver conflito entre este resumo e a documentação atual do projeto, registrar a divergência e usar a evidência mais recente verificável, sem resolver lacunas por suposição.

## 3. Pergunta de validação

A investigação deve verificar se existe um problema operacional real, mensurável e relevante que justifique explorar a proposta MWN/UMS. O primeiro objetivo não é convencer o contato de que a arquitetura é correta, mas descobrir:
1. se o problema existe para aquela organização;
2. como é resolvido atualmente e qual é seu custo;
3. quais requisitos de segurança, qualidade, integração e governança seriam obrigatórios;
4. que evidência seria necessária para avaliar a proposta;
5. se há disposição concreta para uma conversa técnica ou um piloto delimitado.

## 3.1 Gate obrigatório de convergência mútua

A pergunta principal de seleção é: **que utilidade concreta uma capacidade ou hipótese atual de MWN/UMS poderia ter para um interesse, necessidade ou projeto atual deste contato?** A pergunta complementar é o que a pessoa poderia, por sua vez, ajudar a validar ou esclarecer no projeto. Não selecionar alguém apenas porque sua competência é útil para MeshWave.

Antes de recomendar uma conversa, registrar os dois lados com evidências separadas:

- **Agenda do contato:** iniciativa, projeto, pesquisa, produto ou problema profissional atual, sustentado por fonte pública específica da pessoa. Cargo, setor, organização ou experiência histórica isolados não bastam.
- **Utilidade potencial para o contato:** benefício específico que uma capacidade existente ou hipótese claramente marcada de MWN/UMS poderia ter naquela agenda. Descrever a maturidade e as condições; não apresentar roadmap, simulador ou proposta como serviço comprovado.
- **Contribuição potencial ao projeto:** requisito, crítica, validação ou cenário que o contato poderia contribuir, ligado à sua atividade atual documentada. Não presumir interesse, disponibilidade, autoridade ou recursos.
- **Interseção testável:** pergunta curta que convide a pessoa a confirmar, corrigir ou rejeitar a hipótese, sem afirmar que a considera valiosa.

Usar `MUTUAL_FIT_ELIGIBLE` somente quando há evidência específica para a agenda do contato, benefício plausível para ela e contribuição plausível ao projeto; isso autoriza recomendar uma conversa exploratória, não presume interesse. Se faltar evidência, usar `MUTUAL_FIT_UNCONFIRMED` e não preparar mensagem. Se somente o contato puder ajudar MWN/UMS, usar `ONE_WAY_PROJECT_FIT` e não recomendar abordagem por este protocolo. Se não houver interseção atual verificável, usar `NO_CURRENT_FIT`.

## 4. Perfis prioritários e sinais de aderência

As categorias abaixo ajudam a identificar possíveis contribuições ao projeto, mas não são, sozinhas, critérios de elegibilidade. Avaliar contatos já mapeados somente após aplicar o gate bilateral acima. Uma hipótese de utilidade para o contato deve estar ligada à agenda atual dele/dela e às capacidades reais ou hipóteses explicitamente delimitadas de MWN/UMS.

### A. Potenciais usuários de serviços computacionais
Organizações com custos ou restrições mensuráveis em processamento, armazenamento, banda, roteamento, distribuição de tarefas ou recuperação de informação.

**Sinais de aderência:** problema recorrente identificado; métricas ou baseline disponíveis; custo operacional relevante; responsável interno pelo problema; possibilidade de avaliar uma alternativa sem depender de promessas financeiras.

### B. Provedores de capacidade ou recursos
Operadores que possam descrever capacidade ociosa, custo marginal, disponibilidade, energia, conectividade ou condições de oferta de recursos.

**Sinais de aderência:** dados reais de capacidade/custo; interesse em avaliar utilização adicional; capacidade de explicar restrições técnicas e comerciais; disposição para definir condições de teste.

### C. Especialistas técnicos independentes
Pessoas ou organizações com experiência verificável em sistemas distribuídos, segurança, verificação de tarefas, tolerância a falhas, mecanismos de incentivo ou arquitetura de infraestrutura.

**Sinais de aderência:** competência demonstrável no tema; capacidade de criticar pressupostos e apontar testes falsificáveis; ausência de conflito de interesse não declarado; disponibilidade para revisão técnica exploratória.

### D. Especialistas econômicos, regulatórios ou de governança
Pessoas com experiência relevante em modelos de incentivo, economia de infraestrutura, governança, regulação ou riscos de representação de unidades de valor.

**Sinais de aderência:** experiência diretamente relacionada; capacidade de identificar hipóteses econômicas e riscos regulatórios concretos; independência e transparência sobre conflitos.

Não classificar alguém como aderente apenas por ser investidor, executivo, pesquisador, profissional de blockchain ou pessoa conhecida. A aderência precisa estar sustentada por evidência específica do contato.

## 5. Entradas obrigatórias

1. Este blueprint.
2. `docs/PROTOCOLO_VALIDACAO_EXTERNA.md`.
3. Documentação técnica atual do MWN/UMS pertinente à conversa.
4. Diretório de contatos já mapeados, normalmente `contacts/` no ambiente de trabalho autorizado.
5. Registros anteriores de avaliação ou abordagem do projeto, se existirem.
6. `network/docs/protocols/05_MUTUAL_CONVERGENCE_PROTOCOL.md` v0.3.0, como referência complementar para evidência de agenda atual, benefício mútuo e elegibilidade de mensagem: [link canônico](https://github.com/meshwave65/network/blob/main/docs/protocols/05_MUTUAL_CONVERGENCE_PROTOCOL.md).

O HH deve localizar dinamicamente os arquivos disponíveis, sem presumir um nome único para o arquivo de contatos. Deve verificar se o contato já foi avaliado ou abordado, para evitar duplicidade.

### Bloqueios

- Se o blueprint ou o protocolo-base não estiver disponível, registrar o bloqueio e não inventar escopo.
- Se não houver contatos mapeados acessíveis, entregar relatório de bloqueio solicitando execução do OCINT; não iniciar mapeamento independente.
- Se a identidade, a organização ou a evidência de competência não puder ser verificada, marcar como **não verificado** e não apresentar a inferência como fato.
- Se faltarem informações para personalizar uma mensagem com segurança, registrar a lacuna e não preencher com suposições.

## 6. Procedimento de execução

### Etapa 1 — Leitura e preparação
- Ler este blueprint e o protocolo-base integralmente.
- Ler a referência de convergência mútua indicada nas entradas obrigatórias; registrar divergências e aplicar a regra mais conservadora.
- Consultar os documentos atuais do projeto necessários para não exagerar suas capacidades.
- Identificar o local real dos contatos mapeados e os registros anteriores.
- Registrar a data, os arquivos consultados e a versão/commit dos documentos relevantes, quando disponível.

### Etapa 2 — Triagem dos contatos
Para cada contato existente:
- preservar nome e organização exatamente como registrados;
- registrar a fonte disponível e o nível de verificação;
- identificar a categoria de aderência principal e, se pertinente, uma secundária;
- identificar a agenda/projeto/necessidade atual do próprio contato e sua evidência;
- responder “o que MWN/UMS poderia oferecer especificamente a este contato?” e indicar a capacidade/fonte e sua maturidade;
- registrar separadamente a contribuição possível do contato para o projeto;
- registrar o estado `MUTUAL_FIT_ELIGIBLE`, `MUTUAL_FIT_UNCONFIRMED`, `ONE_WAY_PROJECT_FIT` ou `NO_CURRENT_FIT`;
- formular uma pergunta de confirmação/correção que teste a utilidade para o contato;
- apontar a evidência concreta de aderência;
- separar fatos explícitos de inferências;
- verificar duplicatas e histórico de abordagem;
- classificar a prioridade como **Alta**, **Média**, **Baixa** ou **Sem aderência demonstrada**.

**Prioridade Alta:** evidência atual e específica da agenda do contato, utilidade plausível para essa agenda, contribuição plausível ao projeto e próximo passo exploratório delimitado.
**Prioridade Média:** há hipótese de valor nos dois sentidos, mas uma lacuna material ainda impede recomendar abordagem; registrar `MUTUAL_FIT_UNCONFIRMED` e não preparar mensagem.
**Prioridade Baixa:** relação temática genérica ou possível contribuição apenas unilateral do contato ao projeto; registrar `ONE_WAY_PROJECT_FIT` quando aplicável, sem recomendar abordagem.
**Sem aderência demonstrada:** as evidências não sustentam uma interseção profissional atual nem utilidade plausível para o contato.

A prioridade não é uma afirmação de interesse. Somente o contato pode confirmar se o benefício existe ou se a conversa é útil para sua agenda.

### Etapa 3 — Avaliação individual
Para cada contato com prioridade Alta ou Média, produzir:
- evidências a favor;
- evidências contrárias e riscos de abordagem;
- lacunas que precisam ser confirmadas;
- evidência da agenda atual do contato e explicação específica do benefício plausível para essa agenda;
- capacidade/hipótese de MWN/UMS que fundamenta a utilidade, com maturidade, fonte e limites;
- contribuição potencial do contato e a hipótese de benefício mútuo, sem atribuir interesse confirmado;
- hipótese específica que a conversa poderia testar;
- pergunta inicial mais útil;
- próximo passo recomendado.

Não atribuir interesse, autoridade de decisão, orçamento, capacidade de pilotagem ou intenção de investimento sem fonte explícita.

### Etapa 4 — Preparação de abordagem
Preparar mensagem individual somente para contato `MUTUAL_FIT_ELIGIBLE` com Prioridade Alta. Para Prioridade Média, ausência de evidência de benefício ao contato ou `ONE_WAY_PROJECT_FIT`, não preparar mensagem; documentar a lacuna. A mensagem elegível deve apresentar a hipótese bilateral como algo a confirmar e perguntar se a conversa é útil para o trabalho atual do contato. Ela deve:
- referenciar somente fatos verificáveis sobre a pessoa/organização;
- ser curta, profissional e específica;
- apresentar o contato como conversa exploratória de validação, não como venda disfarçada;
- descrever MWN/UMS com linguagem proporcional à evidência disponível;
- convidar a discutir um problema, requisitos ou crítica técnica;
- não pedir aporte financeiro no primeiro contato;
- não prometer retorno, valorização, conversibilidade, preço, liquidez ou remuneração;
- não declarar que PoUW, rede distribuída ou integração remota estejam comprovados;
- não incluir alegações técnicas que não constem na documentação verificada.

Se a abordagem adequada for uma introdução por terceiro, registrar a necessidade; não presumir autorização nem redigir como se a apresentação já estivesse concedida.

**O HH apenas prepara e persiste as mensagens. Não as envia.** O envio e o acompanhamento pertencem ao fluxo/agente autorizado para comunicação.

### Etapa 5 — Registro da evidência e classificação
Usar a escala do protocolo:
- **E0 — Sem interesse:** a pessoa declara que não há problema relevante ou que não deseja continuar.
- **E1 — Interesse exploratório:** aceita conversar ou pede documentação, sem compromisso.
- **E2 — Problema quantificado:** fornece cenário, métricas, custos ou requisitos concretos.
- **E3 — Compromisso de piloto:** há responsável, escopo, critérios de sucesso e janela de execução identificados.
- **E4 — Piloto executado:** há dados observados e resultados documentados.
- **E5 — Adoção/contrato:** há decisão real de uso ou contratação.

E0–E5 registram evidência externa de validação, não a elegibilidade do contato nem a convergência mútua. Antes de haver contato/resposta verificável, registrar `NOT_ASSESSED` (**“Ainda não contatado / evidência externa inexistente”**), nunca E0. Uma hipótese bilateral não significa interesse confirmado; o contato deve poder corrigi-la ou rejeitá-la. Registrar E0 com fidelidade, sem excluir respostas negativas do relatório.

### Etapa 6 — Persistência
Persistir os resultados nos arquivos do projeto e nos caminhos existentes do repositório. Não criar uma nova estrutura paralela se já houver convenção aplicável.

Se ainda não houver estrutura específica, propor/usar esta organização dentro do diretório do projeto:
- `contacts/assessments/mwc-ums/` — avaliações individuais dos contatos;
- `contacts/messages-drafts/mwc-ums/` — rascunhos prontos para revisão/envio;
- `reports/HH-VALIDACAO-EXTERNA-MWC-UMS.md` — relatório consolidado.

Não alterar registros de origem de contatos para inserir conjecturas. Usar links ou referências aos registros originais quando possível. Não duplicar dados pessoais desnecessários.

### Etapa 7 — Relatório final
O relatório consolidado deve conter:
1. data e versão/commit dos documentos consultados;
2. total de contatos examinados;
3. total por prioridade e por categoria;
4. total por estado de convergência mútua e quantos foram considerados elegíveis para conversa;
5. contatos já abordados anteriormente e duplicidades evitadas;
6. melhores candidatos, justificando os dois lados do benefício e o nível de verificação;
7. mensagens preparadas e caminho de cada arquivo;
8. lacunas e bloqueios;
9. evidência externa existente, classificada E0–E5, sem inflar os níveis;
10. próximos passos recomendados;
11. limites explícitos: avaliação de contatos não prova demanda; mensagens preparadas não são mensagens enviadas; interesse exploratório não equivale a piloto, receita ou contratação.

## 7. Perguntas para entrevistas — guia de preparação

O HH deve selecionar poucas perguntas adequadas ao perfil, não enviar um questionário extenso de forma automática.

**Para potenciais usuários**
- Qual problema operacional relacionado a processamento, armazenamento, banda ou distribuição de tarefas é mais relevante hoje?
- Há algum projeto ou objetivo seu que poderia se beneficiar de uma capacidade específica de MWN/UMS, se demonstrada? Que evidência ou condição tornaria essa utilidade real para você?
- Como é medido e qual é o custo ou impacto atual?
- Que requisito mínimo uma alternativa teria de cumprir para ser avaliada?
- Quais dados, riscos ou integrações impediriam um teste?

**Para provedores de recursos**
- Como medem capacidade ociosa, custo marginal e disponibilidade?
- Que objetivo ou necessidade atual do seu trabalho poderia ser atendido, se algum, por uma hipótese ou capacidade documentada de MWN/UMS? O que teria de ser demonstrado para que isso lhe trouxesse valor?
- Quais limitações técnicas, contratuais ou regulatórias restringem a oferta?
- Que dados e controles seriam necessários para avaliar uma utilização alternativa?

**Para especialistas técnicos**
- Quais hipóteses técnicas da proposta precisam ser demonstradas primeiro?
- Existe uma iniciativa, pesquisa ou problema técnico atual seu para o qual revisar ou testar essa hipótese seria útil? Qual seria o benefício concreto para seu trabalho, se houver?
- Como definiria uma tarefa útil verificável e uma prova resistente a fraude?
- Quais testes adversariais ou condições de falha invalidariam a proposta?

**Para especialistas econômicos/regulatórios**
- Quais premissas de incentivo, custo e governança precisam ser explicitadas?
- Que objetivo ou necessidade profissional atual sua poderia se beneficiar de examinar o caso MWN/UMS, se algum, e que escopo tornaria essa conversa útil para você?
- Que riscos surgem ao representar valores contábeis como se fossem valor realizável?
- Quais requisitos jurídicos ou de conformidade precisam ser analisados antes de qualquer piloto?

## 8. Critérios de avanço para um piloto

Não recomendar um piloto somente porque houve resposta positiva. A recomendação exige evidência de:
- um problema ou objetivo atual do participante e uma hipótese bilateral explícita sobre como MWN/UMS poderia ser útil a ele/ela, sem prometer uma capacidade não demonstrada;
- tarefa concreta e legalmente autorizada;
- baseline mensurável da solução atual;
- critério de qualidade verificável;
- custo, risco e requisitos de integração identificados;
- participante externo e responsável identificados;
- critérios de sucesso e interrupção definidos antes do teste;
- plano de segurança e tratamento de dados;
- limites explícitos sobre o que o protótipo/simulador efetivamente implementa.

Se esses requisitos não estiverem presentes, recomendar a próxima conversa ou investigação necessária, não um piloto prematuro.

## 9. Limites de autoridade

O HH:
- **DEVE** ler este blueprint antes de iniciar;
- **DEVE** usar contatos já mapeados;
- **DEVE** fundamentar a avaliação em fontes rastreáveis;
- **DEVE** preparar mensagens personalizadas apenas quando houver aderência;
- **DEVE** registrar resultados e objeções com honestidade;
- **NÃO DEVE** assumir a função de mapeamento do OCINT;
- **NÃO DEVE** inventar contatos, fontes, credenciais, interesses ou compromissos;
- **NÃO DEVE** enviar mensagens nem afirmar que foram enviadas;
- **NÃO DEVE** prometer investimento, retorno, liquidez, conversão ou desempenho;
- **NÃO DEVE** alterar código, modelo econômico ou arquitetura como parte desta missão;
- **NÃO DEVE** ampliar o escopo para outros projetos;
- **NÃO DEVE** concluir que há validação de mercado sem evidência externa documentada.

## 10. Definição de concluído

A missão estará concluída quando:
- todos os contatos acessíveis e relevantes para a missão tiverem sido triados, ou as limitações de acesso estiverem documentadas;
- cada candidato Alta/Média tiver avaliação fundamentada ou lacuna explicitada;
- rascunhos personalizados estiverem persistidos para candidatos elegíveis;
- o relatório consolidado registrar contagens, evidências, objeções, lacunas e próximos passos;
- nenhum resultado tiver sido inventado e nenhum envio externo tiver sido alegado sem confirmação;
- a alteração estiver persistida no repositório e o relatório indicar o commit.

**Resultado esperado:** um conjunto pequeno e defensável de possíveis interlocutores para testar a existência de um problema real e a viabilidade de uma avaliação futura — não uma lista inflada de leads e não uma declaração antecipada de validação de mercado.
