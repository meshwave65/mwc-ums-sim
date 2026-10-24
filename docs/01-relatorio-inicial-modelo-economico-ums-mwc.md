# MeshWave — Relatório inicial do modelo econômico UMS/MWN
**Versão:** 0.1 — premissas preliminares  
**Data:** 20 de outubro de 2026  
**Status:** Documento de trabalho; não constitui oferta pública nem promessa de valorização.

## 1. Objetivo

Registrar a primeira formulação do modelo econômico da MeshWave para a Unidade MeshWave de Serviço (UMS), a MWN, a contribuição de recursos pelos MeshWalkers e uma possível emissão inicial. Os parâmetros são rudimentares e servem como ponto de partida; deverão ser revistos com dados operacionais, estudos econômicos, validação técnica e análise jurídica.

## 2. Unidade de conta e valor de referência

Adotam-se, para este modelo inicial:

- **1 segundo de processamento da máquina de referência = 1 UMS**.
- Máquina de referência: CPU de aproximadamente 8 núcleos, 32 GB de RAM, SSD de 1 TB e Linux.
- Custo de aquisição adotado: R$ 4.800, amortizado em 120 meses: R$ 40/mês.
- Custo de energia adotado: R$ 72/mês.
- Custo total de referência: R$ 112/mês.
- Considerando 30 dias por mês: 2.592.000 segundos/mês.
- Custo aproximado por segundo/UMS: R$ 112 / 2.592.000 = **R$ 0,00004321 por UMS**.
- **1.000 UMS = 1 MWN**, resultando em **R$ 0,04321 por MWN** como valor econômico inicial de referência.

Esses números são premissas de trabalho, não uma avaliação independente do ativo nem garantia de preço de mercado.

## 3. Serviço-base: roteamento

Para estabelecer uma primeira equivalência operacional, adota-se um pacote de referência de 1.500 bytes e uma capacidade simplificada de 80 pacotes por milissegundo (80.000 pacotes por segundo). Assim, 1 segundo de processamento da máquina de referência equivale a 1 UMS e, neste exemplo, corresponde ao processamento de 80.000 pacotes.

É uma hipótese simplificada para comparação inicial, não um benchmark universal de desempenho de roteadores.

## 4. Referência externa de armazenamento

Como comparação comercial preliminar, utiliza-se o preço publicado como referência para Amazon S3 Standard de US$ 0,023 por GB-mês, com câmbio indicativo de R$ 5,03/US$:

- 1 GB-mês: aproximadamente R$ 0,11569.
- Dividido pelo valor de referência de R$ 0,04321/MWN: aproximadamente **2,677 MWN por GB-mês**.
- 100 GB-mês: aproximadamente 267,7 MWN.
- 1.000 GB-mês (1 TB decimal): aproximadamente 2.677 MWN.

O preço varia conforme região, classe de armazenamento e condições comerciais. Requisições, recuperação e transferência de dados podem gerar custos adicionais. Este é um benchmark externo de preço, não uma afirmação de que o custo próprio da MeshWave será igual ao da AWS.

## 5. Preços comerciais livres e registro em UMS

Na fase inicial, a MeshWave poderá vender processamento, armazenamento, conectividade e outros serviços por preços livremente negociados, inclusive em reais, sem exigir que UMS ou MWN sejam desde logo a unidade de cobrança ao cliente.

Cada operação deverá, contudo, registrar uma equivalência de referência em UMS. Diferenças entre a referência e o preço efetivamente negociado serão registradas como ágio ou deságio comercial da operação, sem alterar automaticamente o parâmetro de referência da UMS.

Exemplo ilustrativo: se um serviço tiver referência de R$ 120 e for vendido por R$ 100, o deságio comercial é de 16,67%. O registro permite comparar operações sem confundir preço promocional com revisão do modelo econômico.

## 6. Contribuição dos MeshWalkers e geração de créditos

O modelo prevê que os MeshWalkers cedam recursos de processamento e armazenamento, incluindo a contribuição mínima compulsória de 1% e contribuições voluntárias adicionais, conforme regras próprias a serem definidas.

A contribuição poderá gerar créditos em UMS de acordo com os recursos reconhecidos e os critérios de remuneração. Esses créditos poderão ser usados para consumir serviços e, segundo regras explícitas de conversão, dar origem a saldo ou recompensa em MWN. A quantidade de MWN não deve ser presumida automaticamente a partir de qualquer contribuição: deverá decorrer de regras de emissão, contabilização e conversão documentadas.

Um MeshWalker que disponibilize recursos de valor reconhecido superior ao seu consumo poderá, conforme as regras futuras, reduzir ou até eliminar a necessidade de comprar MWN para pagar pelos serviços utilizados.

## 7. Validação provisória e evolução para PoUW

Na etapa inicial, a MeshWave poderá aproveitar métricas, registros e ferramentas de monitoramento existentes nos ambientes dos clientes e fornecedores para obter evidências provisórias de capacidade entregue e utilização.

Exemplos de evidências:
- **Processamento:** tempo de CPU, núcleos disponíveis, memória, tarefas concluídas e registros de execução.
- **Armazenamento:** espaço disponibilizado e utilizado, período de disponibilidade e registros de acesso.
- **Conectividade:** bytes transferidos, largura de banda, disponibilidade e tráfego efetivo.

Capacidade anunciada, capacidade disponibilizada e trabalho efetivamente realizado são grandezas diferentes. Cada serviço deverá ter critérios próprios de validação. Esses dados constituem uma camada provisória de evidência, não um PoUW completo e independente.

A evolução técnica poderá incluir módulos de registro, medição, verificação e prevenção de fraude, até mecanismos próprios de Proof of Useful Work (PoUW), adequados a cada modalidade de contribuição.

## 8. Serviços que podem gerar demanda antes da rede completa

A utilidade econômica da MWN não precisa aguardar a implantação integral da rede distribuída. Serviços do ecossistema — incluindo SOFIA, Jardim do Éden e Condenser — poderão adotar UMS como unidade de mensuração e MWN como meio de pagamento, quando comercial e tecnicamente disponíveis.

Isso pode criar demanda transacional antes da conclusão da infraestrutura MeshWave, desde que os serviços sejam efetivamente oferecidos, a moeda seja aceita nas condições anunciadas e existam regras claras de cobrança, crédito e conversão.

## 9. Hipótese de emissão inicial

Como exercício preliminar, considera-se o valor de referência de R$ 0,04321/MWN e um deságio de lançamento de 50%:

- Valor de referência: R$ 0,04321/MWN.
- Preço hipotético de emissão com deságio de 50%: R$ 0,021605/MWN.
- Captação hipotética: R$ 500.000.
- Quantidade matemática correspondente: R$ 500.000 / R$ 0,021605 ≈ **23.142.791,02 MWN**.

Se a emissão ocorrer apenas em unidades inteiras, será necessário arredondar a quantidade e recalcular o total. A mesma quantidade, ao valor de referência de R$ 0,04321, corresponderia a aproximadamente R$ 1 milhão.

Este cálculo não garante captação, liquidez, resgate ou manutenção do preço. A captação efetiva depende de compradores dispostos a pagar o preço proposto, das condições de oferta e da conformidade jurídica e regulatória da operação.

## 10. Princípios para a política econômica

1. Manter uma unidade de conta comum (UMS) para comparar serviços diferentes.
2. Registrar os preços comerciais efetivos separadamente do valor de referência.
3. Vincular créditos de contribuição a critérios mensuráveis e documentados.
4. Definir separadamente emissão, crédito, conversão e uso de MWN.
5. Aproveitar métricas operacionais existentes como evidência provisória, evoluindo para validação própria.
6. Tratar os parâmetros iniciais como hipóteses revisáveis, registrando a metodologia e as alterações.
7. Não apresentar o valor de referência como garantia de preço, resgate ou valorização.
8. Antes de uma emissão ou oferta pública, obter análise jurídica e regulatória específica.

## 11. Referências externas iniciais

- AWS, página de preços do Amazon S3: https://aws.amazon.com/s3/pricing/ — consultar a região e a classe de armazenamento aplicáveis antes de atualizar o benchmark.
- CVM, Parecer de Orientação 40 — Os CriptoAtivos e o Mercado de Valores Mobiliários: https://www.gov.br/cvm/pt-br/Treinamento/legislacao/pareceres-de-orientacao/copy2_of_portaria-conjunta-mf-cvm-no-92-de-21-de-marco-de-2018 — referência para análise do enquadramento e das obrigações aplicáveis.
- CVM, FAQ “Criptoativos: quando se aplicam as regras da CVM?”: https://www.gov.br/cvm/pt-br/acesso-a-informacao-cvm/perguntas-frequentes-da-cvm/criptoativos-quando-se-aplicam-as — orientação geral atualizada em fevereiro de 2026.

Os preços comerciais, o câmbio e a classificação jurídica devem ser reconfirmados no momento de qualquer publicação externa ou emissão.

## 12. Próximos artefatos recomendados

- Política de emissão e limites de oferta de MWN.
- Tabela de conversão de serviços em UMS.
- Política de remuneração de contribuições dos MeshWalkers.
- Especificação inicial de evidências e validação (PoUW provisório).
- Simulador econômico com parâmetros editáveis e cenários.
- Análise jurídica/regulatória da emissão e dos meios de pagamento.

---
**Nota metodológica:** este documento reúne premissas de trabalho discutidas para formar uma primeira base. Não substitui benchmark técnico, auditoria de custos, avaliação financeira, parecer jurídico ou documentação definitiva de emissão.
