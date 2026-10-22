# MeshWave — Arquitetura cooperativa, sandbox global e economia de recursos

**Versão:** 0.1 — consolidação conceitual  
**Data:** 22 de outubro de 2026  
**Status:** Documento de trabalho. Registra princípios definidos conceitualmente e questões técnicas ainda por especificar. Não representa comprovação de implementação nem auditoria de segurança.

## 1. Objetivo

Consolidar os princípios arquiteturais e econômicos discutidos para a MeshWave: integração obrigatória por módulos integradores, segregação entre domínio privado e recursos cedidos, formação de uma sandbox global, contribuição nativa de 1%, oferta adicional sob demanda, balanceamento distribuído de carga, remuneração por Proof of Useful Work (PoUW) e referências relevantes do estado da arte.

O documento diferencia:
- **Princípios definidos para o modelo MeshWave:** decisões conceituais expressas neste relatório.
- **Referências do estado da arte:** tecnologias, padrões e pesquisas existentes que ajudam a orientar a implementação.
- **Questões em aberto:** mecanismos que precisam ser especificados, testados e validados antes de qualquer alegação de garantia técnica.

## 2. Síntese executiva

A MeshWave é concebida como uma infraestrutura computacional coletiva, não apenas como um mercado de serviços conectados à Internet. Todo nó participante deve interconectar-se à rede por meio dos módulos integradores correspondentes. A integração disponibiliza apenas interfaces e recursos autorizados; não concede, por si só, acesso lógico irrestrito ao ambiente privado do MeshWalker.

Cada nó conectado contribui nativamente com **1% de sua capacidade de processamento e 1% de sua capacidade de armazenamento** para a infraestrutura comum. Essa parcela é compulsória dentro do modelo e destina-se à criação, manutenção, operação e evolução do ecossistema. É a base estrutural de recursos de pronto uso da rede, condicionada à disponibilidade e à saúde operacional dos nós.

O MeshWalker pode autorizar uma contribuição adicional, por exemplo, mais 10%. Esse percentual adicional é um **limite potencial de oferta**, não uma obrigação de manter os recursos ocupados. A rede só deve alocar essa capacidade quando existir demanda compatível e após avaliar critérios como latência, localização, tipo de recurso, disponibilidade, custo de comunicação, requisitos de segurança e preservação da atividade privada do participante.

A remuneração pela contribuição adicional depende do trabalho útil efetivamente realizado e validado conforme critérios de PoUW. Capacidade anunciada, reservada ou ociosa não equivale automaticamente a trabalho útil executado. A contribuição nativa de 1% possui finalidade distinta: sustentar a própria rede, e não remunerar individualmente o participante como se fosse uma execução adicional.

A ideia orientadora é **Be the network**: os participantes integram recursos à infraestrutura coletiva, mas mantêm segregado seu domínio privado. A cooperação deve depender de mecanismos técnicos verificáveis, não de promessas genéricas de privacidade ou de confiança irrestrita entre concorrentes.

## 3. Princípios arquiteturais

### 3.1 Interconexão obrigatória

Não há participação operacional paralela aos módulos integradores. Equipamentos, recursos e serviços que participem da MeshWave devem conectar-se por meio da camada de integração apropriada. Essa camada permite descoberta, autorização, medição, coordenação e comunicação dentro dos protocolos definidos pela rede.

A localização física pode continuar em datacenters tradicionais, instalações empresariais, ambientes domésticos ou nós de borda. O requisito é a integração lógica e operacional à MeshWave, não a propriedade de um tipo específico de equipamento.

### 3.2 Domínios segregados

Cada equipamento mantém dois domínios conceituais:

1. **Domínio privado:** sistemas, aplicações, dados, credenciais e recursos reservados à atividade própria do MeshWalker.
2. **Domínio cedido à rede:** parcela delimitada de processamento, armazenamento e, quando aplicável, conectividade disponibilizada à MeshWave.

A rede opera sobre os recursos cedidos e as interfaces explicitamente autorizadas. A conexão não deve conceder acesso geral ao sistema operacional, aos arquivos, às credenciais ou às aplicações privadas do participante.

A segregação precisa ser imposta tecnicamente — por limites de recursos, isolamento de execução, controle de acesso, identidades de serviço e proteção da comunicação — e não apenas representada por uma porcentagem em configuração.

### 3.3 Sandbox global

A expressão **sandbox global** descreve conceitualmente um ambiente virtual distribuído composto pelas parcelas físicas segregadas e disponibilizadas pelos nós. Não significa uma única máquina virtual centralizada nem pressupõe que todos os recursos sejam homogêneos ou imediatamente intercambiáveis.

A capacidade útil depende de disponibilidade real, arquitetura de CPU, memória, armazenamento, conectividade, localização, latência, confiabilidade e compatibilidade da carga de trabalho. A soma nominal dos recursos não equivale necessariamente à capacidade útil agregada.

### 3.4 Túneis e comunicação

A comunicação entre módulos e nós deve ocorrer por canais controlados, autenticados e protegidos, incluindo túneis conforme o desenho de rede. Túneis protegem o transporte, mas não substituem isolamento de execução, autorização por recurso, gestão de identidade ou proteção contra cargas maliciosas.

## 4. Dois regimes de contribuição

### 4.1 Contribuição nativa: 1%

Todo nó conectado disponibiliza nativamente 1% de sua capacidade de processamento e 1% de sua capacidade de armazenamento para a infraestrutura coletiva.

Finalidade:
- criar e manter a base de recursos do ecossistema;
- sustentar a operação e a coordenação da rede;
- financiar, em termos de recursos, a evolução da própria MeshWave;
- formar a parcela estrutural de capacidade de pronto uso.

Essa contribuição é compulsória segundo o modelo proposto. A especificação técnica ainda deve definir como medir a capacidade de referência, quando a porcentagem é calculada, como lidar com recursos indisponíveis e como impedir que a reserva comprometa a atividade privada.

A expressão “pronto uso” não deve ser interpretada como garantia de que todo recurso esteja sempre online, acessível ou adequado a qualquer tarefa. É uma base de prontidão sujeita às condições operacionais dos nós.

### 4.2 Contribuição adicional: oferta variável

O MeshWalker pode definir uma parcela adicional de recursos. Por exemplo, autorizar até 10% além da contribuição nativa.

Esse valor define um teto de capacidade que a rede pode considerar; não implica alocação contínua, consumo obrigatório ou degradação deliberada do equipamento. Na ausência de demanda compatível, a capacidade adicional permanece sem alocação para a rede.

A alocação deve ser:
- orientada por demanda real;
- compatível com os requisitos da tarefa;
- limitada aos recursos autorizados;
- subordinada a políticas de isolamento e preservação do domínio privado;
- reversível ou ajustável conforme regras de execução e segurança previamente definidas.

### 4.3 Distinção econômica

| Dimensão | Contribuição nativa | Contribuição adicional |
|---|---|---|
| Origem | Obrigatória para o nó conectado no modelo | Autorizada voluntariamente pelo MeshWalker |
| Finalidade | Sustentar e evoluir a rede | Atender demanda útil da rede |
| Alocação | Base estrutural de pronto uso, condicionada à disponibilidade | Somente quando houver demanda compatível |
| Remuneração individual por PoUW | Não é a finalidade definida para essa parcela | Vinculada ao trabalho útil realizado e validado |
| Segregação | Obrigatória | Obrigatória |

## 5. Alocação, balanceamento de carga e reciprocidade

A MeshWave pode coordenar recursos distribuídos para absorver picos de demanda e aproveitar capacidade ociosa. Um provedor pode disponibilizar recursos em períodos de baixa utilização e, em outro momento, consumir capacidade de outros participantes para responder a picos, evitando dimensionar toda a infraestrutura própria para o máximo de demanda.

Isso permite cooperação operacional entre concorrentes comerciais sem exigir que compartilhem clientes, dados comerciais, propriedade intelectual ou controle dos respectivos sistemas. A reciprocidade não precisa ser direta: o fornecedor do recurso e seu consumidor podem ser participantes diferentes, em momentos diferentes.

### 5.1 Critérios possíveis para selecionar recursos

- existência e prioridade da demanda;
- tipo de recurso e compatibilidade técnica;
- localização e latência;
- disponibilidade, saúde e confiabilidade do nó;
- custo de transferência de dados e comunicação;
- requisitos de residência e sensibilidade dos dados;
- isolamento e nível de segurança exigidos;
- capacidade autorizada e limites de consumo;
- possibilidade de interromper, migrar ou concluir a tarefa com segurança.

### 5.2 Regra de proteção do participante

**A rede não deve ocupar capacidade adicional apenas porque ela foi anunciada.** Não havendo demanda compatível, a capacidade excedente permanece sem alocação. A participação não deve provocar degradação evitável da atividade privada para manter recursos ociosos ocupados dentro da rede.

A implementação deve definir limites de CPU, memória, I/O e armazenamento, além de políticas de prioridade, contenção, cancelamento e recuperação. Para armazenamento, deve distinguir espaço autorizado, espaço efetivamente ocupado, retenção, I/O e custos de manutenção.

## 6. PoUW e remuneração da contribuição adicional

O Proof of Useful Work (PoUW) é aqui o princípio de reconhecer trabalho útil efetivamente realizado, em vez de remunerar simplesmente a declaração de capacidade. A remuneração da contribuição adicional deve depender de evidências e regras verificáveis.

O sistema deve distinguir pelo menos:

1. **Capacidade declarada:** limite máximo que o MeshWalker autoriza.
2. **Capacidade elegível:** parcela compatível com a tarefa e disponível segundo as políticas da rede.
3. **Capacidade alocada:** recursos efetivamente atribuídos à execução.
4. **Trabalho executado:** processamento, armazenamento ou outra operação efetivamente realizada.
5. **Trabalho validado:** resultado que satisfaz as verificações definidas para a tarefa.
6. **Contribuição remunerável:** unidade reconhecida segundo a política PoUW aplicável.

Esses estados não são equivalentes. Uma tarefa pode falhar, ser cancelada, produzir resultado inválido ou consumir recursos sem entregar o resultado exigido. A política deve tratar tais situações explicitamente.

A metodologia de PoUW permanece um tema de projeto: será necessário definir evidências, verificadores, prevenção de fraude, tratamento de resultados duplicados, atribuição de contribuição entre nós, tolerância a falhas e resolução de disputas. O termo PoUW, por si só, não especifica um algoritmo universal nem garante que a execução possa ser verificada sem confiança adicional.

## 7. Privacidade e segurança como propriedades arquiteturais

A privacidade é concebida como propriedade estrutural, não como benefício prometido por uma política. O objetivo é reduzir o que precisa ser confiado aos outros participantes por meio de segregação, autorização mínima e verificabilidade.

Controles a considerar:
- isolamento forte de processos ou máquinas virtuais conforme o risco da carga;
- identidade individual para nós, serviços e cargas;
- autenticação e autorização antes de cada acesso a recurso;
- princípio do menor privilégio e credenciais de curta duração quando aplicável;
- túneis e proteção criptográfica da comunicação;
- limites de recursos e contenção entre cargas;
- atualização, inventário, revogação e resposta a nós comprometidos;
- logs de auditoria com minimização de dados sensíveis;
- proteção de dados em repouso, em trânsito e, quando necessário, durante o processamento;
- atestação e ambientes de execução confidencial para cargas que exijam proteção adicional.

Não se deve afirmar que a arquitetura elimina todos os riscos. O objetivo é estabelecer fronteiras verificáveis, reduzir a superfície de ataque e testar os mecanismos contra ameaças explícitas. A segurança depende também da implementação, do hardware, da cadeia de atualização, da configuração e do modelo de ameaças.

## 8. Estado da arte: referências e relação com a MeshWave

O estado da arte não indica que a arquitetura completa da MeshWave já exista como produto pronto. Há tecnologias e linhas de pesquisa consolidadas que cobrem partes do problema; a proposta MeshWave combina esses elementos com regras próprias de contribuição e economia.

### 8.1 Zero Trust Architecture (ZTA)

O NIST SP 800-207 estabelece que não se deve conceder confiança implícita a usuários ou dispositivos apenas por sua localização na rede ou por pertencerem à organização. A proteção deve se concentrar nos recursos, com autenticação e autorização explícitas.

O NIST SP 800-207A aprofunda modelos de controle de acesso para aplicações cloud-native e ambientes multicloud, incluindo identidade de serviços, gateways e políticas granulares.

**Relação com a MeshWave:** dá suporte à ideia de que estar conectado à rede ou pertencer a um participante não concede acesso irrestrito. A MeshWave precisará traduzir esse princípio em identidade, autorização por recurso e política aplicável aos módulos integradores.

Referências:
- NIST SP 800-207: https://csrc.nist.gov/pubs/sp/800/207/final
- NIST SP 800-207A: https://csrc.nist.gov/pubs/sp/800/207/a/final

### 8.2 Confidential Computing

O NIST descreve computação confidencial como uso de recursos habilitados por hardware para isolar e processar dados em memória, reduzindo o risco de exposição a cargas concorrentes ou à plataforma subjacente. Ambientes de execução confiáveis (TEEs) e mecanismos de atestação são componentes relevantes dessa área.

**Relação com a MeshWave:** pode oferecer proteção adicional para determinadas cargas em nós que não são administrados pelo proprietário da carga. Não substitui todos os controles, não se aplica igualmente a qualquer workload e pode impor restrições de hardware, desempenho e compatibilidade.

Referência:
- NIST Glossary — Confidential Computing: https://csrc.nist.gov/glossary/term/confidential_computing
- Confidential Computing Consortium — escopo e definição: https://github.com/confidential-computing/governance/blob/main/scoping.md

### 8.3 Autoscaling e orquestração de cargas

O Kubernetes Horizontal Pod Autoscaler é um exemplo de mecanismo de ajuste de capacidade de workloads conforme métricas de demanda. É uma referência de automação e elasticidade em ambientes orquestrados, não uma solução completa para uma rede global de proprietários independentes.

**Relação com a MeshWave:** reforça a utilidade de decisões de alocação orientadas por demanda e métricas. A MeshWave tem desafios adicionais: descoberta entre domínios administrativos, heterogeneidade de hardware, latência geográfica, confiança entre participantes, isolamento e contabilização econômica.

Referência:
- Kubernetes — Horizontal Pod Autoscaling: https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/

### 8.4 Proof of Useful Work

A literatura sobre PoUW investiga mecanismos que associam a execução útil à segurança, validação ou incentivo de sistemas distribuídos. Uma revisão sistemática publicada em 2025 analisou estudos de algoritmos PoUW e suas vantagens e limitações. Uma revisão publicada em 2026 na ACM Computing Surveys examina propostas para substituir quebra-cabeças criptográficos por computação útil em protocolos de Proof of Work.

**Relação com a MeshWave:** confirma que PoUW é uma área de pesquisa ativa, mas não estabelece um mecanismo universal aplicável diretamente ao modelo. A MeshWave precisará escolher quais trabalhos são aceitos, como validar resultados, como evitar fraude e como atribuir remuneração.

Referências:
- *A systematic literature review on proof-of-useful work consensus algorithms*, Blockchain: Research and Applications (2025): https://doi.org/10.1016/j.bcra.2025.100387
- *On Replacing Cryptopuzzles with Useful Computation in Blockchain Proof-of-Work Protocols*, ACM Computing Surveys (publicado em 31 de julho de 2026): https://doi.org/10.1145/3828717

### 8.5 Síntese comparativa

| Área | O que oferece hoje | O que não resolve automaticamente para a MeshWave |
|---|---|---|
| Zero Trust | Princípios de identidade, autorização e ausência de confiança implícita | Implementação concreta e governança de todos os nós |
| Confidential Computing | Isolamento reforçado para certas cargas e proteção de dados em uso | Segurança universal para qualquer hardware ou workload |
| Orquestração/autoscaling | Ajuste de capacidade conforme demanda e métricas | Seleção global entre participantes heterogêneos e independentes |
| PoUW | Linhas de pesquisa para associar incentivos a computação útil | Algoritmo de validação e remuneração adequado à MeshWave |
| Túneis e criptografia | Proteção do canal de comunicação | Isolamento de execução e proteção contra comprometimento do endpoint |

## 9. Questões técnicas que precisam de especificação

1. **Denominador do 1%:** definir a capacidade de referência de CPU e armazenamento, o período de medição e o tratamento de dispositivos com recursos variáveis.
2. **Reserva real:** decidir se o 1% representa reserva rígida, limite de uso ou política equivalente por tipo de recurso; medir o impacto sobre o equipamento.
3. **Prontidão:** definir requisitos mínimos de disponibilidade e o que ocorre quando um nó está offline ou inacessível.
4. **Isolamento:** escolher mecanismos de execução, limites de recursos, separação de dados e modelo de ameaça por categoria de workload.
5. **Alocação adicional:** especificar prioridade, seleção de nós, latência máxima, custo de comunicação, cancelamento e retorno à atividade privada.
6. **Armazenamento:** definir criptografia, integridade, redundância, durabilidade, exclusão verificável e remuneração por espaço/tempo/serviço efetivamente prestado.
7. **PoUW:** especificar provas, validadores, tolerância a falhas, fraude, duplicação, disputa e cálculo da remuneração.
8. **Contabilização econômica:** definir como as contribuições e os serviços são registrados em UMS e como os incentivos se relacionam com o uso real.
9. **Privacidade:** definir quais metadados são necessários para coordenar a rede e como minimizar exposição, retenção e correlação.
10. **Teste adversarial:** validar nós maliciosos, workloads hostis, tentativas de escape, abuso de recursos, falhas de rede e comprometimento de módulos integradores.

## 10. Conclusão

A arquitetura proposta combina uma base coletiva sustentada por contribuição nativa de 1% com um regime elástico de contribuição adicional sob demanda. A capacidade excedente não deve ser ocupada artificialmente: ela só é alocada quando houver necessidade compatível, preservando a atividade privada do participante. A remuneração adicional deve decorrer de trabalho útil efetivamente realizado e validado, conforme uma metodologia PoUW ainda a especificar.

A sandbox global é uma composição virtual de recursos físicos segregados, interconectados por módulos integradores e canais controlados. A privacidade deve resultar de fronteiras técnicas verificáveis, não de confiança irrestrita entre participantes. A cooperação pode ocorrer inclusive entre concorrentes, permitindo que capacidade ociosa de um participante ajude a atender picos de demanda de outro.

**Be the network** expressa, portanto, uma regra arquitetural e econômica: participar é integrar-se à infraestrutura comum; todo nó contribui para sua sustentação, e a contribuição produtiva adicional pode ser remunerada conforme o trabalho útil validado.

O documento registra uma arquitetura conceitual e uma leitura do estado da arte; não afirma que os mecanismos estejam implementados, que a segurança esteja provada ou que o modelo econômico esteja validado em produção.
