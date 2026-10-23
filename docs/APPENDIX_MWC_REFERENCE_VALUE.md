# Apêndice — Formação do valor econômico de referência da MWC

**Documento de trabalho — premissas preliminares**  
**Base documental:** Relatório inicial do modelo econômico UMS/MWC, versão 0.1, de 20 de outubro de 2026.

## 1. Finalidade

Este apêndice registra uma metodologia simples e rastreável para formular um valor econômico inicial de referência para a MWC. Nesta etapa, o objetivo não é obter uma avaliação definitiva, mas explicitar de onde vêm os números adotados e estabelecer um parâmetro razoável para orientar a comunicação e o desenvolvimento do modelo. O refinamento das premissas e a validação dos valores ficam reservados à auditoria e à evolução operacional do ecossistema.

O valor de trabalho de aproximadamente **R$ 0,02 por MWC** combina duas dimensões: (1) parâmetros econômicos indicativos, derivados de uma referência simplificada de custo operacional e de um deságio hipotético de 50%; e (2) a credibilidade do fundador e a confiança na capacidade de execução e no potencial de utilidade do ecossistema MeshWave. Os cálculos dão transparência à origem do parâmetro, mas não determinam sozinhos o valor econômico do instrumento. A confiança é um componente da expectativa de valor, não uma garantia de preço realizável.

A comparação com armazenamento por GB-mês serve como referência comercial externa complementar, não como origem matemática direta dos R$ 0,02. Todos os parâmetros são hipóteses de trabalho, não custos auditados, benchmark universal, oferta pública, preço de mercado garantido ou promessa de resgate/valorização.

## 2. Máquina-padrão e custo operacional de referência

A máquina de referência adotada no cálculo preliminar tem aproximadamente:

- CPU de 8 núcleos;
- 32 GB de RAM;
- SSD de 1 TB;
- sistema Linux.

Premissas econômicas:

| Parâmetro | Premissa |
|---|---:|
| Custo de aquisição adotado | R$ 4.800 |
| Prazo de amortização | 120 meses |
| Amortização mensal | R$ 40 |
| Energia mensal estimada | R$ 72 |
| Custo mensal total de referência | R$ 112 |
| Duração de referência do mês | 30 dias |
| Segundos em 30 dias | 2.592.000 |

Cálculo:

`R$ 112 / 2.592.000 segundos = R$ 0,0000432099 por segundo`

Para a contabilidade conceitual inicial, adotou-se:

`1 segundo de processamento da máquina-padrão = 1 UMS`

Assim, o custo estimado correspondente a uma UMS é aproximadamente **R$ 0,00004321**.

A premissa de 1 UMS por segundo é uma convenção de modelagem. Não significa que qualquer máquina execute o mesmo trabalho por segundo, nem que a capacidade real seja uniforme entre processadores, cargas, sistemas operacionais ou tarefas.

## 3. Relação entre UMS e MWC

A hipótese inicial adotou a relação de conta:

`1.000 UMS = 1 MWC`

Aplicando-a ao custo estimado da máquina-padrão:

`1.000 × R$ 0,00004321 ≈ R$ 0,04321 por MWC`

Esse resultado é uma **referência econômica indicativa** derivada de premissas simplificadas. Ele ajuda a explicar a origem do parâmetro, mas não pretende representar, isoladamente, o valor integral da MWC nem constitui preço obrigatório de venda, cotação de mercado ou valor de resgate.

## 4. Como se chegou à referência aproximada de R$ 0,02

Foi aplicado, como hipótese de preço inicial, um deságio de 50% sobre a referência de R$ 0,04321:

`R$ 0,04321 × (1 − 0,50) = R$ 0,021605 por MWC`

Arredondando para comunicação, o resultado é aproximadamente **R$ 0,02 por MWC**.

A título exclusivamente ilustrativo, a hipótese matemática de captação de R$ 500.000, caso fosse adotado o preço não arredondado de R$ 0,021605, corresponderia a:

`R$ 500.000 / R$ 0,021605 ≈ 23.142.791,02 MWC`

Esse cálculo é apenas aritmético. Não comprova demanda, não define uma emissão aprovada e não garante que o montante possa ser captado. Uma emissão real exigiria regras explícitas de oferta, limites, direitos, governança e análise jurídica e regulatória.

## 5. Comparação externa: armazenamento por GB-mês

Como referência comercial externa preliminar, o relatório usou o preço de referência do Amazon S3 Standard de **US$ 0,023 por GB-mês** e câmbio indicativo de **R$ 5,03 por dólar**.

Cálculo ilustrativo:

`US$ 0,023 × R$ 5,03/US$ ≈ R$ 0,11569 por GB-mês`

Comparando esse custo com o valor econômico de referência de R$ 0,04321 por MWC:

`R$ 0,11569 / R$ 0,04321 ≈ 2,677 MWC por GB-mês`

Esse benchmark ajuda a relacionar uma unidade econômica proposta a um serviço externo observável de armazenamento durante um mês. Ele não prova que o custo próprio da MeshWave será igual ao da AWS. Região, classe de armazenamento, redundância, requisições, recuperação e transferência podem alterar o preço.

**Importante:** o cálculo acima não é a origem direta do valor de R$ 0,02. Ele é uma comparação de serviço. A referência de R$ 0,02 veio do custo operacional estimado da máquina-padrão, da relação 1.000 UMS = 1 MWC e do deságio hipotético de 50%.

## 6. Distinção em relação à hipótese anterior de armazenamento

Em uma formulação anterior foi usada outra hipótese: **R$ 6 por GB-mês** e **1.000 MWC para 1 GB-mês**, o que resulta em:

`R$ 6 / 1.000 = R$ 0,006 por MWC`

Essa conta é aritmeticamente correta para aquelas premissas, mas representa uma hipótese diferente da metodologia descrita neste apêndice. Ela não deve ser combinada silenciosamente com o cálculo baseado em custo de máquina.

A diferença deve permanecer documentada para que uma decisão econômica posterior estabeleça qual metodologia, serviço de referência e regra de conversão serão adotados. Até essa decisão, os valores devem ser tratados como cenários históricos distintos, não como uma única fórmula coerente já validada.

## 7. O que o modelo ainda não demonstra

O cálculo preliminar não demonstra:

- custo real por tarefa em uma rede MeshWave implantada;
- equivalência universal entre segundos de máquinas diferentes;
- custo operacional completo de armazenamento, conectividade, redundância, segurança e administração;
- demanda ou disposição de compradores a pagar determinado preço;
- conversibilidade entre UMS e MWC;
- liquidez, preço externo, valorização ou direito de resgate;
- validação independente das premissas.

O modelo deverá evoluir com medições reais, preços e câmbio atualizados, critérios por tipo de serviço, prevenção de dupla contagem e auditoria das premissas. A auditoria revisará os parâmetros objetivos e sua coerência; a credibilidade do ecossistema dependerá também da execução efetiva, da utilidade demonstrada e da transparência na aplicação das regras.

## 8. Referências

- Relatório inicial do modelo econômico UMS/MWC, versão 0.1, 20 de outubro de 2026.
- AWS — preços do Amazon S3: https://aws.amazon.com/s3/pricing/

A referência externa deve ser reconfirmada antes de qualquer publicação ou decisão comercial. Este apêndice registra a origem do cálculo e suas limitações; não constitui oferta de investimento nem promessa de retorno.
