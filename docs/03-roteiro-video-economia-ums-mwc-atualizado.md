# MeshWave — Roteiro atualizado de vídeo: economia UMS/MWC e infraestrutura cooperativa

**Versão:** 0.2 — correção conceitual e roteiro audiovisual  
**Data:** 22 de outubro de 2026  
**Repositório:** `meshwave65/mwc-ums-sim`  
**Status:** Roteiro conceitual para apresentação. Premissas econômicas e mecanismos ainda sujeitos a validação técnica, econômica e jurídica.

---

## 1. Objetivo do vídeo

Explicar de forma visual e acessível como a MeshWave pretende conectar uma infraestrutura computacional cooperativa a uma economia interna denominada em UMS e a uma economia externa acessível por meio de MWC.

O vídeo deve evitar a confusão central corrigida nesta versão:

> **UMS é a unidade de pagamento e contabilização dos serviços dentro do ecossistema MeshWave. MWC não circula internamente: é o ativo de fronteira que conecta a economia interna à economia externa por meio da exchange nativa.**

O vídeo também apresenta a lógica de contribuição de recursos, a diferença entre contribuição nativa e contribuição adicional, o PoUW e a liberdade comercial dos provedores.

**Duração sugerida:** 8 a 10 minutos.  
**Tom:** explicativo, estratégico e tecnicamente responsável.  
**Público:** potenciais usuários, provedores de infraestrutura, parceiros, investidores e participantes do ecossistema.

## 2. Regras conceituais obrigatórias para roteiro, narração e animações

1. **Não representar MWC pagando serviços internos.** Pagamentos e preços internos são denominados em UMS.
2. **Não representar MWC circulando entre serviços, usuários e provedores dentro da MeshWave.** MWC aparece na fronteira econômica, conectado à exchange nativa e ao mercado externo.
3. **Representar os dois sentidos da conversão:** entrada no ecossistema: MWC → UMS; saída do ecossistema: UMS → MWC.
4. **Não apresentar a relação de 1.000 UMS = 1 MWC como preço de mercado garantido.** É uma relação inicial proposta para o modelo, sujeita a definição e validação.
5. **Não confundir equivalência de referência com resgate garantido.** O painel UMS/MWC/moeda fiduciária serve para compreensão e comparação de custos; não muda a unidade de cobrança interna nem garante conversibilidade por preço fixo.
6. **Não sugerir que toda capacidade adicional anunciada será consumida.** Ela só deve ser alocada se houver demanda compatível.
7. **Não remunerar capacidade ociosa como se fosse trabalho realizado.** A remuneração adicional depende de trabalho útil efetivamente realizado e validado conforme a metodologia PoUW.
8. **Não tratar a privacidade como mera promessa contratual.** A proposta exige segregação técnica entre recursos cedidos e ambiente privado do participante.
9. **Separar fatos, princípios propostos e hipóteses.** O vídeo não deve sugerir que mecanismos ainda não implementados estejam em produção ou tenham segurança comprovada.

---

# 3. Roteiro audiovisual

## Cena 1 — A pergunta central: como uma rede cooperativa cria valor?
**Tempo:** 0:00–0:45

**Imagem**
- Nós distribuídos: computadores, servidores, equipamentos Edge e clusters.
- Linhas de conexão formando uma malha.
- Recursos ociosos em alguns nós e demanda crescente em outros.

**Narração**

> E se a infraestrutura digital não precisasse depender apenas de grandes centros de processamento dimensionados para atender ao pico máximo de cada organização?
>
> E se diferentes participantes pudessem integrar recursos a uma infraestrutura coletiva, aproveitando capacidade disponível e recorrendo à capacidade da rede quando sua própria demanda aumentasse?
>
> Essa é uma das ideias centrais da MeshWave: uma rede formada por recursos integrados de seus participantes, com regras comuns de operação e uma economia própria para contabilizar serviços e contribuições.

**Texto na tela**
- Infraestrutura coletiva
- Recursos distribuídos
- Demanda dinâmica

## Cena 2 — Be the network: integrar recursos, não apenas acessar serviços
**Tempo:** 0:45–1:40

**Imagem**
- Um equipamento dividido visualmente em dois domínios.
- Domínio privado de um lado; parcela segregada e conectada à malha do outro.
- Módulo integrador e túnel protegido entre os nós.

**Narração**

> “Be the network” não significa apenas conectar-se a uma plataforma para consumir serviços. Significa integrar-se à infraestrutura coletiva.
>
> No modelo proposto, cada nó conectado disponibiliza nativamente 1% de sua capacidade de processamento e 1% de sua capacidade de armazenamento para sustentar a criação, a manutenção e a evolução da própria rede.
>
> Essa contribuição nativa forma a base estrutural de recursos de pronto uso, sujeita à disponibilidade real dos nós.
>
> O MeshWalker também pode autorizar recursos adicionais. Mas anunciar capacidade não significa que ela será automaticamente ocupada: a rede só deve alocá-la quando existir demanda compatível.

**Texto na tela**
- 1% nativo: contribuição estrutural
- Capacidade adicional: alocação sob demanda
- Segregação entre domínio privado e domínio coletivo

**Nota de produção**
Mostrar o 1% nativo e a parcela adicional com cores distintas. Não desenhar a rede assumindo controle irrestrito do equipamento privado.

## Cena 3 — A sandbox global e a privacidade estrutural
**Tempo:** 1:40–2:25

**Imagem**
- Parcelas de processamento e armazenamento segregadas em vários nós.
- As parcelas formam uma camada virtual coletiva.
- Dados e aplicações privadas permanecem visualmente separados.

**Narração**

> Os recursos disponibilizados pelos nós formam, em conjunto, uma sandbox global: um ambiente virtual distribuído a partir de parcelas físicas segregadas dos ambientes privados dos participantes.
>
> A integração acontece por módulos integradores e canais controlados, incluindo túneis de comunicação. Participar da rede não deve significar conceder acesso irrestrito aos próprios sistemas, arquivos, credenciais ou dados.
>
> Essa separação precisa ser sustentada por mecanismos técnicos de isolamento, controle de acesso, proteção da comunicação e limitação de recursos. Privacidade não é apenas uma promessa: é um requisito arquitetural que precisa ser implementado e verificado.

**Texto na tela**
- Recursos segregados
- Módulos integradores
- Acesso controlado
- Privacidade como requisito arquitetural

## Cena 4 — Cooperação entre concorrentes e balanceamento de carga
**Tempo:** 2:25–3:15

**Imagem**
- Provedor A enfrenta um pico de demanda.
- Provedor B tem capacidade disponível.
- A rede encaminha uma tarefa compatível para os recursos cedidos por B.
- Em outro momento, as condições se invertem.

**Narração**

> Imagine dois provedores que competem pelos mesmos clientes. Em determinado momento, o provedor A enfrenta um pico de demanda, enquanto o provedor B tem capacidade ociosa.
>
> Se os recursos forem compatíveis, estiverem disponíveis e atenderem aos requisitos de latência, localização e segurança, a MeshWave pode coordenar a utilização da capacidade de B para ajudar a atender à demanda de A.
>
> O concorrente continua concorrente no mercado. Na infraestrutura, porém, pode ser justamente quem ajuda a atender ao próximo cliente.
>
> A cooperação não precisa ser direta nem simultânea: quem disponibiliza recursos não precisa ser quem os consome, nem fazê-lo no mesmo momento.

**Texto na tela**
- Balanceamento distribuído
- Capacidade ociosa → demanda compatível
- Cooperação operacional sem fusão empresarial

**Nota de produção**
Não sugerir que qualquer tarefa pode migrar para qualquer nó. A alocação depende de compatibilidade, políticas e validação técnica.

## Cena 5 — Duas unidades com funções diferentes: UMS e MWC
**Tempo:** 3:15–4:20

**Imagem**
- Apresentar a economia interna MeshWave em um painel próprio.
- UMS circula entre usuários e serviços internos.
- MWC aparece fora desse domínio, conectado somente pela exchange nativa.
- Deixar visualmente explícita a fronteira entre os dois espaços.

**Narração**

> Para compreender a economia da MeshWave, é fundamental distinguir duas funções.
>
> A UMS é a unidade utilizada para denominar pagamentos, preços e contabilização de serviços dentro do ecossistema.
>
> A MWC tem outra função. Ela não circula internamente nem é usada para pagar diretamente os serviços da rede. A MWC é o ativo de fronteira que conecta a economia interna da MeshWave à economia externa.
>
> A exchange nativa é o portal dessa conversão. Para ingressar na economia interna, o participante converte MWC em UMS. Para levar valor para fora, converte UMS em MWC e, então, pode negociar MWC no mercado externo, conforme a disponibilidade de listagem, liquidez e mecanismos de negociação.

**Texto na tela**
- Dentro da MeshWave: UMS
- Fronteira econômica: exchange nativa
- Fora da MeshWave: MWC e mercado externo

**Animação obrigatória**
- Entrada: **MWC → exchange nativa → UMS → serviços internos**
- Saída: **serviços/receitas internas em UMS → exchange nativa → MWC → mercado externo**
- Não desenhar MWC dentro do fluxo de pagamentos internos.

## Cena 6 — Como UMS se relaciona com o uso e a contribuição
**Tempo:** 4:20–5:20

**Imagem**
- Um MeshWalker utiliza um serviço e a operação é contabilizada em UMS.
- Outro nó fornece capacidade adicional para uma tarefa.
- Trabalho concluído passa por validação antes de ser reconhecido para remuneração.

**Narração**

> A UMS fornece uma unidade comum para contabilizar a economia interna. O participante paga em UMS pelos serviços que utiliza, e os provedores recebem receitas internas denominadas em UMS.
>
> A contribuição nativa de 1% tem uma finalidade distinta: sustentar a própria infraestrutura coletiva.
>
> Já os recursos adicionais podem ser remunerados segundo critérios de Proof of Useful Work, ou PoUW. A distinção é importante: capacidade anunciada não é trabalho executado, e capacidade ociosa não deve ser remunerada como se tivesse concluído uma tarefa útil.
>
> A remuneração adicional depende de trabalho efetivamente realizado e validado conforme regras específicas, que precisam ser definidas e testadas.

**Texto na tela**
- UMS: pagamentos e contabilização internos
- 1% nativo: sustentação da rede
- Capacidade adicional: PoUW por trabalho útil validado

## Cena 7 — Uma economia interna, preços comerciais livres e tarifas operacionais comuns
**Tempo:** 5:20–6:15

**Imagem**
- Diferentes provedores oferecem serviços semelhantes com preços distintos em UMS.
- Em outro painel, uma tabela de serviços operacionais nativos da rede.

**Narração**

> A unidade comum não significa que todos os serviços tenham o mesmo preço.
>
> Cada empresa ou provedor pode definir livremente seus preços em UMS para serviços comerciais, como aplicações, processamento dedicado, armazenamento e ferramentas de inteligência artificial. Os MeshWalkers escolhem entre ofertas considerando preço, qualidade, desempenho e disponibilidade.
>
> Isso é diferente dos serviços operacionais nativos necessários para o funcionamento da própria rede. Para essas funções, a MeshWave pode definir uma tabela comum de tarifas em UMS, distinguindo o custo de utilização da remuneração paga a quem efetivamente contribui.
>
> A UMS padroniza a unidade de conta; não elimina a concorrência nem centraliza todos os preços comerciais.

**Texto na tela**
- Serviços comerciais: preços definidos pelos provedores em UMS
- Operação nativa da rede: tarifas comuns definidas pela MeshWave
- Concorrência em preço, qualidade e desempenho

## Cena 8 — O painel de referência: UMS, MWC e moeda fiduciária
**Tempo:** 6:15–7:00

**Imagem**
- Painel de comparação com três colunas: custo em UMS, equivalência indicativa em MWC, equivalência indicativa em moeda fiduciária.
- Exemplo de um plano de serviço, sem sugerir preço comercial universal.
- Legendas “referência indicativa” e “preço externo variável”.

**Narração**

> Para facilitar a compreensão dos custos, a MeshWave pode oferecer um painel de referência que mostre o preço interno em UMS e suas equivalências indicativas em MWC e em moeda fiduciária.
>
> Esse painel ajuda o usuário a comparar custos com referências que conhece. Mas não altera a regra fundamental: o serviço interno continua sendo cobrado em UMS.
>
> A equivalência em MWC depende da relação de conversão aplicável; a equivalência em moeda fiduciária depende também da referência externa escolhida e, quando pertinente, do preço de mercado da MWC.
>
> Uma equivalência informativa não é promessa de resgate, preço garantido ou garantia de liquidez.

**Texto na tela**
- Cobrança interna: UMS
- MWC: equivalência de conversão
- Moeda fiduciária: referência indicativa
- Valores sujeitos às regras aplicáveis e às condições de mercado

## Cena 9 — Conversão, demanda funcional e mercado externo
**Tempo:** 7:00–8:00

**Imagem**
- Um provedor recebe receitas em UMS.
- Parte do saldo é usada para pagar outros serviços internos.
- Um excedente pode seguir pela exchange nativa para MWC.
- Outro participante precisa repor seu saldo interno e faz o caminho inverso.
- Do lado externo, mostrar negociação de MWC sem garantir alta de preço.

**Narração**

> A lógica econômica pode gerar necessidades funcionais de conversão.
>
> Um provedor que recebe receitas em UMS pode utilizá-las para pagar outros serviços internos. Se tiver excedente e desejar levá-lo para fora do ecossistema, poderá convertê-lo em MWC por meio da exchange nativa, sujeito às regras e à liquidez disponíveis.
>
> Outro participante pode precisar adquirir MWC no mercado externo para convertê-lo em UMS e pagar serviços dentro da MeshWave.
>
> Essa dinâmica cria uma ligação econômica entre a atividade interna e a MWC. Mas demanda funcional não garante valorização. O resultado externo depende também de emissão, saldos, fluxos de compra e venda, regras de conversão, liquidez e condições de mercado.

**Texto na tela**
- Receita interna em UMS
- Conversão pela exchange nativa
- Negociação externa de MWC
- Demanda funcional não é garantia de valorização

## Cena 10 — Referências econômicas e premissas ainda abertas
**Tempo:** 8:00–8:45

**Imagem**
- Mostrar uma ficha de “premissas de trabalho”, sem visual de cotação oficial.
- Destacar 1.000 UMS = 1 MWC com rótulo “relação inicial proposta”.

**Narração**

> O modelo econômico utiliza referências iniciais para permitir simulações e comparação de custos. Entre elas está a relação proposta de 1.000 UMS para 1 MWC.
>
> Essa relação deve ser tratada como premissa de trabalho, não como cotação de mercado ou promessa de conversão garantida.
>
> Da mesma forma, qualquer referência de custo associada ao processamento, armazenamento ou roteamento precisa ser validada com medições reais, critérios de contabilização e testes operacionais.
>
> A proposta deve evoluir a partir de evidências, simulações e validação técnica, econômica e jurídica.

**Texto na tela**
- Premissas iniciais
- Simulação não é mercado
- Validação antes de promessas

## Cena 11 — Fechamento: uma rede que se sustenta e se expande
**Tempo:** 8:45–9:30

**Imagem**
- Nós contribuindo com a parcela nativa.
- Recursos adicionais ativados conforme demanda.
- Serviços de diferentes provedores conectados.
- UMS dentro do ecossistema; exchange como fronteira; MWC no exterior.

**Narração**

> A MeshWave combina uma infraestrutura coletiva, uma unidade econômica interna e uma ponte para a economia externa.
>
> Cada nó contribui para sustentar a rede. Recursos adicionais podem ser alocados quando houver demanda e remunerados conforme o trabalho útil efetivamente validado. Os serviços internos operam em UMS, enquanto a MWC conecta essa economia ao mercado externo por meio da exchange nativa.
>
> A proposta não é apenas acessar uma rede. É integrar recursos a uma infraestrutura comum, cooperar com outros participantes e preservar a separação entre o domínio privado e a capacidade cedida.
>
> **MeshWave. Be the network.**

**Texto final na tela**
**BE THE NETWORK**
- Integre recursos.
- Utilize a capacidade coletiva.
- Ofereça serviços.
- Preserve a segregação do domínio privado.

---

## 4. Glossário visual para a equipe de produção

| Elemento | Representação correta | Evitar |
|---|---|---|
| UMS | Unidade interna de conta, pagamento e contabilização | Tratar como equivalente automático a moeda fiduciária |
| MWC | Ativo de fronteira para conversão entre economia interna e externa | Usar MWC para pagar serviços internos |
| Exchange nativa | Único portal conceitual entre UMS e MWC | Desenhar conversão direta por fora da exchange |
| Mercado externo | Local de negociação de MWC, sujeito a listagem e liquidez | Prometer liquidez, resgate ou valorização |
| 1% nativo | Contribuição estrutural de recursos para a rede | Tratar como capacidade adicional remunerada por PoUW |
| Recursos adicionais | Capacidade potencial alocada apenas quando houver demanda compatível | Mostrar todos os recursos anunciados sendo ocupados |
| PoUW | Reconhecimento de trabalho útil realizado e validado | Remunerar apenas por capacidade declarada |
| Sandbox global | Camada virtual formada por recursos segregados dos nós | Sugerir acesso irrestrito aos sistemas privados |
| Painel de equivalência | Referência de custos UMS/MWC/moeda fiduciária | Apresentar equivalência como garantia de resgate |

## 5. Premissas econômicas de referência para uso editorial

O relatório econômico inicial contém premissas de referência que podem aparecer no vídeo somente se forem explicitamente identificadas como hipóteses preliminares:

- Máquina de referência: aproximadamente 8 núcleos de CPU, 32 GB de RAM, SSD de 1 TB e Linux.
- Custo de aquisição adotado: R$ 4.800, amortizado em 120 meses.
- Energia estimada: R$ 72 por mês.
- Custo mensal total estimado: R$ 112.
- Hipótese inicial: 1 segundo de processamento da máquina de referência = 1 UMS.
- Relação inicial proposta: 1.000 UMS = 1 MWC.

Essas referências não devem ser apresentadas como benchmark universal, preço garantido, avaliação independente ou promessa de resgate. O vídeo pode omitir os números detalhados se eles desviarem o foco da explicação conceitual.

## 6. Nota sobre Genesis e emissão inicial

Caso o vídeo mencione Genesis, deve distinguir o reconhecimento inicial de trabalho útil previamente realizado, quando aplicável e auditado segundo critérios definidos, da emissão posterior de UMS vinculada a trabalho útil efetivamente realizado e validado por PoUW.

Não apresentar o Genesis como emissão arbitrária nem afirmar que um processo de auditoria, critérios finais ou mecanismo de emissão já estão implementados sem evidência correspondente. Os detalhes precisam ser tratados em documentação econômica específica.

## 7. Checklist de revisão antes da gravação

- [ ] MWC nunca aparece circulando no ecossistema interno.
- [ ] Todos os pagamentos e preços internos aparecem denominados em UMS.
- [ ] A exchange nativa é mostrada como fronteira de conversão.
- [ ] Os fluxos MWC → UMS e UMS → MWC estão ambos representados.
- [ ] A relação 1.000 UMS = 1 MWC é identificada como premissa inicial, não garantia.
- [ ] O painel de equivalência é informativo; não altera a unidade de cobrança.
- [ ] Preços comerciais são definidos pelos provedores em UMS.
- [ ] Tarifas operacionais nativas são distinguidas de preços comerciais.
- [ ] O 1% nativo é apresentado como contribuição estrutural da rede.
- [ ] Recursos adicionais são alocados sob demanda e não ficam ocupados artificialmente.
- [ ] A remuneração adicional depende de trabalho útil validado, não de capacidade anunciada.
- [ ] A privacidade é apresentada como requisito arquitetural a implementar e verificar, sem prometer invulnerabilidade.
- [ ] Nenhum mecanismo conceitual é descrito como já implementado sem verificação.
- [ ] Não há promessa de liquidez, resgate, valorização ou preço externo garantido.

## 8. Mensagem central a preservar

A MeshWave propõe uma infraestrutura coletiva composta por recursos integrados e segregados dos ambientes privados dos participantes. A UMS organiza a economia interna de pagamentos e contabilização. A MWC conecta essa economia ao mercado externo exclusivamente por meio da exchange nativa. O 1% nativo sustenta a infraestrutura; a capacidade adicional pode ser alocada quando houver demanda compatível e remunerada segundo trabalho útil validado.

**A rede é coletiva. Os serviços competem. A unidade interna é UMS. A MWC faz a ponte externa. Be the network.**
