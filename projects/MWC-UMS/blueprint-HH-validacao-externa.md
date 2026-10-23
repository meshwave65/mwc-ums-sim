# Blueprint HH — Validação externa do projeto MWC/UMS

**Agente responsável:** HH (Head Hunter)  
**Projeto:** MWC/UMS — simulador e proposta de infraestrutura distribuída  
**Tipo de missão:** identificar aderência entre contatos já mapeados e a validação externa do projeto  
**Estado inicial:** protocolo de pesquisa definido; não presumir que entrevistas, pilotos, clientes ou compromissos já existam  
**Documento-base:** `docs/PROTOCOLO_VALIDACAO_EXTERNA.md`  
**Limite central:** o HH avalia contatos existentes e prepara abordagens personalizadas. Não substitui o OCINT, não inventa contatos e não envia mensagens por conta própria.

## 1. Missão

Encontrar, entre os contatos já mapeados e disponíveis no repositório/contexto de contatos autorizado, pessoas ou organizações com aderência demonstrável a pelo menos uma das frentes de validação externa do MWC/UMS. Para cada contato relevante, produzir uma avaliação fundamentada e, quando houver aderência suficiente, uma mensagem de primeiro contato personalizada que proponha uma conversa exploratória sobre o problema operacional — sem apresentar o simulador como produto operacional comprovado nem pedir investimento como primeiro passo.

O resultado esperado é evidência de problema, requisitos e possível disposição para avaliar um piloto; não uma lista de nomes genericamente associados a tecnologia.

## 2. Contexto que o HH deve preservar

O estado conhecido do projeto é limitado:
- Existe um simulador de MWC/UMS e testes automatizados de robustez e experimentos econômicos.
- A matriz experimental executa 50 combinações de cenário/semente e 2.000 rodadas simuladas no total. Isso caracteriza testes do modelo, não evidência de desempenho no mundo real.
- Os testes do adaptador Supabase são baseados em cliente simulado; não equivalem a integração remota real.
- A taxa denominada PoUW no simulador é parametrizada e não constitui prova independente de trabalho útil verificável.
- Não há, por força deste blueprint, evidência de rede distribuída operacional, mercado, preço, liquidez, conversibilidade em BRL, sustentabilidade econômica, clientes ou pilotos reais.
- BRL de referência contábil não pode ser descrito como dinheiro, receita, preço de mercado ou garantia de conversão.

Antes de analisar os contatos, o HH deve ler o protocolo-base e, se disponíveis, os documentos técnicos atuais do projeto. Se houver conflito entre este resumo e a documentação atual do projeto, registrar a divergência e usar a evidência mais recente verificável, sem resolver lacunas por suposição.

## 3. Pergunta de validação

A investigação deve verificar se existe um problema operacional real, mensurável e relevante que justifique explorar a proposta MWC/UMS. O primeiro objetivo não é convencer o contato de que a arquitetura é correta, mas descobrir:
1. se o problema existe para aquela organização;
2. como é resolvido atualmente e qual é seu custo;
3. quais requisitos de segurança, qualidade, integração e governança seriam obrigatórios;
4. que evidência seria necessária para avaliar a proposta;
5. se há disposição concreta para uma conversa técnica ou um piloto delimitado.

## 4. Perfis prioritários e sinais de aderência

Avaliar contatos já mapeados nas quatro categorias abaixo:

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
3. Documentação técnica atual do MWC/UMS pertinente à conversa.
4. Diretório de contatos já mapeados, normalmente `contacts/` no ambiente de trabalho autorizado.
5. Registros anteriores de avaliação ou abordagem do projeto, se existirem.

O HH deve localizar dinamicamente os arquivos disponíveis, sem presumir um nome único para o arquivo de contatos. Deve verificar se o contato já foi avaliado ou abordado, para evitar duplicidade.

### Bloqueios

- Se o blueprint ou o protocolo-base não estiver disponível, registrar o bloqueio e não inventar escopo.
- Se não houver contatos mapeados acessíveis, entregar relatório de bloqueio solicitando execução do OCINT; não iniciar mapeamento independente.
- Se a identidade, a organização ou a evidência de competência não puder ser verificada, marcar como **não verificado** e não apresentar a inferência como fato.
- Se faltarem informações para personalizar uma mensagem com segurança, registrar a lacuna e não preencher com suposições.

## 6. Procedimento de execução

### Etapa 1 — Leitura e preparação
- Ler este blueprint e o protocolo-base integralmente.
- Consultar os documentos atuais do projeto necessários para não exagerar suas capacidades.
- Identificar o local real dos contatos mapeados e os registros anteriores.
- Registrar a data, os arquivos consultados e a versão/commit dos documentos relevantes, quando disponível.

### Etapa 2 — Triagem dos contatos
Para cada contato existente:
- preservar nome e organização exatamente como registrados;
- registrar a fonte disponível e o nível de verificação;
- identificar a categoria de aderência principal e, se pertinente, uma secundária;
- apontar a evidência concreta de aderência;
- separar fatos explícitos de inferências;
- verificar duplicatas e histórico de abordagem;
- classificar a prioridade como **Alta**, **Média**, **Baixa** ou **Sem aderência demonstrada**.

**Prioridade Alta:** aderência específica e verificável, problema ou competência diretamente relacionado e próximo passo plausível.  
**Prioridade Média:** aderência razoável, mas uma lacuna relevante precisa ser esclarecida.  
**Prioridade Baixa:** relação temática genérica, sem sinal concreto de necessidade, competência ou disponibilidade.  
**Sem aderência demonstrada:** as evidências disponíveis não sustentam abordagem para esta missão.

A prioridade não é uma afirmação de interesse. Não confundir relevância profissional com intenção de participar.

### Etapa 3 — Avaliação individual
Para cada contato com prioridade Alta ou Média, produzir:
- evidências a favor;
- evidências contrárias e riscos de abordagem;
- lacunas que precisam ser confirmadas;
- hipótese específica que a conversa poderia testar;
- pergunta inicial mais útil;
- próximo passo recomendado.

Não atribuir interesse, autoridade de decisão, orçamento, capacidade de pilotagem ou intenção de investimento sem fonte explícita.

### Etapa 4 — Preparação de abordagem
Preparar mensagem individual apenas para contatos cuja aderência justifique o contato. A mensagem deve:
- referenciar somente fatos verificáveis sobre a pessoa/organização;
- ser curta, profissional e específica;
- apresentar o contato como conversa exploratória de validação, não como venda disfarçada;
- descrever MWC/UMS com linguagem proporcional à evidência disponível;
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

O HH não pode atribuir E1–E5 a partir de uma hipótese ou da própria mensagem preparada. Antes de existir resposta externa, registrar **“Ainda não contatado / evidência externa inexistente”**. Registrar E0 com fidelidade, sem excluir respostas negativas do relatório.

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
4. contatos já abordados anteriormente e duplicidades evitadas;
5. melhores candidatos, com justificativa e nível de verificação;
6. mensagens preparadas e caminho de cada arquivo;
7. lacunas e bloqueios;
8. evidência externa existente, classificada E0–E5, sem inflar os níveis;
9. próximos passos recomendados;
10. limites explícitos: avaliação de contatos não prova demanda; mensagens preparadas não são mensagens enviadas; interesse exploratório não equivale a piloto, receita ou contratação.

## 7. Perguntas para entrevistas — guia de preparação

O HH deve selecionar poucas perguntas adequadas ao perfil, não enviar um questionário extenso de forma automática.

**Para potenciais usuários**
- Qual problema operacional relacionado a processamento, armazenamento, banda ou distribuição de tarefas é mais relevante hoje?
- Como é medido e qual é o custo ou impacto atual?
- Que requisito mínimo uma alternativa teria de cumprir para ser avaliada?
- Quais dados, riscos ou integrações impediriam um teste?

**Para provedores de recursos**
- Como medem capacidade ociosa, custo marginal e disponibilidade?
- Quais limitações técnicas, contratuais ou regulatórias restringem a oferta?
- Que dados e controles seriam necessários para avaliar uma utilização alternativa?

**Para especialistas técnicos**
- Quais hipóteses técnicas da proposta precisam ser demonstradas primeiro?
- Como definiria uma tarefa útil verificável e uma prova resistente a fraude?
- Quais testes adversariais ou condições de falha invalidariam a proposta?

**Para especialistas econômicos/regulatórios**
- Quais premissas de incentivo, custo e governança precisam ser explicitadas?
- Que riscos surgem ao representar valores contábeis como se fossem valor realizável?
- Quais requisitos jurídicos ou de conformidade precisam ser analisados antes de qualquer piloto?

## 8. Critérios de avanço para um piloto

Não recomendar um piloto somente porque houve resposta positiva. A recomendação exige evidência de:
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
