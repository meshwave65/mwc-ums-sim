# Documentação funcional — MWC / UMS Simulator

## 1. O que o protótipo demonstra

O simulador apresenta dois universos claramente separados:

| Universo | O que contém | Unidade principal |
| --- | --- | --- |
| Ecossistema MeshWave | usuários, serviços, execução, capacidade e saldo contábil | UMS |
| Mercado externo | capacidade convertida, reserva e reconversão | MWC |

BRL aparece como consequência contábil das operações de mercado. Não há pagamento, carteira, exchange, banco, PIX ou conexão com dinheiro real.

O fluxo observado é:

```text
serviço solicitado
  → execução distribuída
  → PoUW simplificado
  → UMS reconhecida
  → saldo do usuário
  → bloco de 1.000 UMS
  → MWC no mercado externo
  → reconversão para capacidade quando necessário
  → BRL contábil
```

## 2. Estado inicial

A tela começa no estado mais simples possível: rodada 0, dez usuários com 10.000 UMS, BRL zerado e mercado sem MWC. Isso torna visível que nenhum MWC nasce previamente no mercado.

Os perfis usados como ponto de partida são:

| Usuário | Perfil | Tendência didática |
| --- | ---: | --- |
| USER-01 | +20% | excedente mais provável |
| USER-02 | -10% | consumo maior que geração |
| USER-03 | +5% | pequeno excedente |
| USER-04 | -25% | déficit mais provável |
| USER-05 | +15% | excedente |
| USER-06 | -5% | leve déficit |
| USER-07 | +30% | maior geração |
| USER-08 | -15% | déficit |
| USER-09 | +10% | excedente moderado |
| USER-10 | -20% | déficit |

O perfil-base é configurado para cada usuário, mas o perfil efetivo recebe uma variação aleatória limitada em cada rodada. A tabela mostra o perfil efetivo da rodada e conserva o perfil-base como referência. Assim, um usuário pode alternar entre déficit, estabilidade e superávit ao longo da simulação.

## 3. Serviços e demanda

A tabela configurável traz custo em UMS por operação e demanda padrão da rodada. A demanda não é o mesmo que o uso efetivo de um usuário: ela é distribuída conforme o perfil e a variação da rodada.

| Serviço | Custo | Demanda padrão |
| --- | ---: | ---: |
| Roteamento de pacote | 1 UMS | 3.000 |
| Armazenamento temporário | 2 UMS | 1.000 |
| Armazenamento permanente | 5 UMS | 300 |
| Uso de banda | 3 UMS | 2.000 |
| Processamento CPU | 4 UMS | 800 |
| Processamento GPU | 12 UMS | 400 |
| Replicação de dados | 6 UMS | 300 |
| Recuperação de dados | 3 UMS | 300 |
| Cache distribuído | 2 UMS | 600 |
| Transferência entre nós | 4 UMS | 500 |

## 4. Como uma rodada é calculada

1. A demanda de cada serviço é alocada entre os dez usuários.
2. O uso em UMS é obtido multiplicando operações alocadas pelo custo do serviço.
3. O perfil efetivo da rodada determina a capacidade bruta estimada: perfil positivo aumenta geração; perfil negativo reduz. Ele parte do perfil-base configurado e varia dentro do limite de variação da simulação.
4. O PoUW aplica uma taxa de validação. A parcela validada entra como UMS reconhecida; a parcela inválida fica registrada, mas não entra no saldo. Se a operação não for atendida, a geração é proporcional à parte efetivamente executada e não cria capacidade artificial.
5. Se o usuário não tiver capacidade para usar o serviço, o motor tenta reconverter MWC inteiro do mercado.
6. O usuário paga a utilização em UMS, recebe a geração validada e pode atingir um novo bloco de conversão.
7. Cada bloco completo acima do nível inicial vira MWC inteiro e credita BRL de referência ao usuário.
8. O mercado, os KPIs, a tabela, os gráficos, o relatório histórico e o log recebem o novo estado.

A operação é implementada em uma função pura (`runRound`) para manter a regra econômica independente da interface.

## 5. Leitura do dashboard

### Controles

- **Iniciar:** começa no estado atual.
- **Pausar:** interrompe o intervalo sem perder o estado.
- **Continuar:** retoma a execução.
- **Parar:** encerra a execução e gera o relatório final.
- **Resetar:** devolve exatamente ao estado inicial.
- **Velocidade:** altera o intervalo entre rodadas para que o ciclo possa ser observado.
- **Rodadas:** encerra automaticamente em 100, 1.000, 10.000 ou 100.000; `∞` não encerra sozinho.

### KPIs

- **Serviços executados:** operações que tiveram capacidade suficiente; o detalhe mostra não atendidos.
- **UMS reconhecida:** capacidade validada pelo PoUW no acumulado; o detalhe mostra utilização.
- **MWC no mercado:** reserva disponível naquele momento; o detalhe mostra o total gerado.
- **Reconversões:** MWC que retornaram para UMS; o detalhe mostra o volume BRL de referência.
- **UMS no ecossistema:** soma dos saldos atuais dos usuários.

### Tabela de usuários

A coluna Gerado mostra o valor da última rodada e o acumulado. Utilizado segue o mesmo padrão. O status resume a última variação: `SUPERÁVIT`, `DÉFICIT`, `NÃO ATENDIDO` ou `ESTÁVEL`. Quando a atividade recente inclui mercado, o badge pode destacar `MWC GERADO` ou `USOU MERCADO`.

### Mercado externo

O mercado nunca inicia com reserva. MWC cresce quando um usuário converte bloco completo de UMS e diminui quando uma unidade é reconvertida em 1.000 UMS. A geração de uma rodada fica disponível para consumo a partir da rodada seguinte, deixando a reserva observável e evitando que geração e reconversão se anulem na mesma passagem. O BRL de referência do mercado é uma dimensão contábil de reserva; não é forçado a ser igual à soma do BRL dos usuários.

### Gráficos

- **Evolução dos saldos UMS:** uma linha por usuário ao longo do histórico.
- **MWC em circulação:** linhas para gerado, reconvertido e disponível.
- **Comparativo final:** barras ordenadas pelo saldo UMS no encerramento, visualização de BRL positivo/negativo e tabela com a posição completa.

## 6. Configuração

O painel permite alterar UMS inicial, UMS por MWC, BRL por MWC, seed, perfis, demandas e custos. PoUW e a variação máxima aparecem como parâmetros informativos do protótipo. As edições ficam em rascunho e só entram no motor ao pressionar **Aplicar e resetar**, evitando mudar uma execução no meio.

## 7. Exportações

O relatório final pode ser baixado como:

- **JSON:** inclui rodada, usuários, mercado, totais e narrativa.
- **CSV:** agregados da rodada/mercado e tabela consolidada dos usuários, adequada para abrir em planilha.

## 8. Limitações

O protótipo não persiste estado, não faz autenticação, não chama API externa e não usa banco de dados. A reconversão não modela preço variável ou ordens de mercado. A aleatoriedade é controlada, mas o resultado sem seed pode variar. Os valores são exclusivamente demonstrativos.
