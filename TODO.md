# TODO — Critérios de aceite do Simulador MWC / UMS

## Núcleo econômico e estado inicial

- [ ] A aplicação deve abrir diretamente no dashboard da simulação.
- [ ] O protótipo deve separar visualmente o **Ecossistema MeshWave** do **Mercado Externo**.
- [ ] Devem existir inicialmente 10 usuários `USER-01` a `USER-10`.
- [ ] Todos os usuários devem iniciar com `10.000 UMS` e `R$ 0,00`.
- [ ] O mercado deve iniciar com `0 MWC` e `R$ 0,00`, sem MWC inicial.
- [ ] A regra inicial deve ser `1.000 UMS = 1 MWC = R$ 1,00`.
- [ ] O MWC não deve aparecer como saldo interno dos usuários; o dashboard de usuário deve exibir UMS e BRL.
- [ ] O botão RESETAR deve retornar à rodada 0, usuários em 10.000 UMS/R$ 0, mercado em 0 MWC/R$ 0 e histórico vazio.

## Serviços, demanda e perfis

- [ ] Os serviços devem ser expressos e cobrados em UMS.
- [ ] A tabela inicial deve conter roteamento 1 UMS, armazenamento temporário 2, armazenamento permanente 5, banda 3, CPU 4, GPU 12, replicação 6, recuperação 3, cache 2 e transferência 4.
- [ ] A demanda deve ser organizada por rodada e não confundida com a quantidade efetivamente utilizada por cada usuário.
- [ ] Os perfis iniciais devem ser USER-01 +20%, USER-02 -10%, USER-03 +5%, USER-04 -25%, USER-05 +15%, USER-06 -5%, USER-07 +30%, USER-08 -15%, USER-09 +10% e USER-10 -20%.
- [ ] O percentual-base deve permanecer disponível como referência de configuração, enquanto o perfil efetivo deve ser sorteado aleatoriamente a cada rodada na faixa configurada, por padrão entre -20% e +20%, permitindo alternância entre superávit, estabilidade e déficit.
- [ ] Os parâmetros, os perfis e a demanda devem poder ser ajustados no painel de configuração simples.

## Rodadas e PoUW simplificado

- [ ] Cada rodada deve distribuir a atividade entre os usuários, executar operações, calcular custo em UMS, calcular capacidade gerada, validar o resultado e atualizar saldos/histórico.
- [ ] O sistema deve exibir separadamente capacidade gerada, capacidade utilizada e variação de UMS.
- [ ] O fluxo PoUW deve representar serviço solicitado, execução, resultado válido e UMS reconhecida.
- [ ] Operações inválidas não devem gerar UMS definitiva, mas devem permanecer auditáveis no log e no relatório.
- [ ] A execução deve atualizar a interface durante a simulação.
- [ ] Deve ser possível iniciar, pausar, continuar, parar e resetar a execução.
- [ ] Devem existir modos de 100, 1.000, 10.000, 100.000 e infinitas rodadas.
- [ ] O modo infinito deve continuar até PARAR, com processamento em lotes/ritmo seguro para não bloquear o navegador.
- [ ] Devem existir velocidades lenta, normal, rápida e muito rápida, sem ocultar completamente a dinâmica visual.
- [ ] Deve existir seed opcional para permitir repetição controlada de uma execução.

## Conversão UMS/MWC e contabilidade BRL

- [ ] Blocos completos de 1.000 UMS acima do nível inicial devem ser convertidos automaticamente em MWC inteiro.
- [ ] Ao converter, o usuário deve perder a quantidade correspondente de UMS, o mercado deve ganhar MWC e o usuário deve receber o BRL de referência.
- [ ] O mercado deve mostrar MWC disponível, preço de referência, MWC gerados, MWC reconvertidos, volume convertido e volume BRL movimentado.
- [ ] Quando um usuário não tiver UMS suficiente para sua necessidade, o sistema deve verificar MWC disponível no mercado.
- [ ] Cada unidade MWC reconvertida deve devolver 1.000 UMS ao usuário, retirar 1 MWC do mercado e debitar R$ 1,00 do BRL do usuário.
- [ ] Usuário pode ter BRL negativo.
- [ ] Se não houver MWC suficiente, a parte não atendida deve ser registrada sem fabricar capacidade.
- [ ] A soma do BRL dos usuários não deve ser artificialmente forçada a ser igual ao BRL de referência do mercado.

## Dashboard, tabela e log

- [ ] O dashboard deve mostrar rodada atual, velocidade, status, serviços executados, UMS geradas/utilizadas, MWC criados e MWC reconvertidos.
- [ ] A tabela deve mostrar usuário, perfil, UMS, BRL, serviços, gerado, utilizado e status.
- [ ] Deve ser fácil identificar quem acumula UMS, consome UMS, está superavitário, está deficitário, gera MWC ou recorre ao mercado.
- [ ] Deve existir log de eventos em tempo real com rodada, PoUW, geração de UMS, conversão, reconversão e operações não atendidas.
- [ ] O ciclo serviço → execução → PoUW → UMS → acumulação → MWC → mercado → BRL → reconversão deve possuir representação visual compreensível.

## Visualizações e relatório final

- [ ] Deve existir gráfico de evolução dos saldos UMS dos usuários ao longo das rodadas.
- [ ] Deve existir gráfico de MWC gerado, reconvertido e disponível.
- [ ] Deve existir visualização de BRL positivo/negativo por usuário.
- [ ] Os gráficos devem atualizar durante a execução.
- [ ] Ao parar/concluir a simulação, deve aparecer um relatório final da situação de cada usuário.
- [ ] O relatório deve apresentar rodada final, serviços solicitados/executados/não atendidos, UMS geradas/utilizadas, MWC gerados/reconvertidos/disponíveis e BRL movimentado.
- [ ] O relatório deve incluir gráfico comparativo de saldo UMS e situação final de cada usuário.
- [ ] O relatório deve poder ser exportado em JSON e CSV pelo navegador.
- [ ] A interface e o relatório devem deixar claro que os valores são simulados e não representam moeda ou operação financeira real.

## Entrega e documentação

- [ ] O projeto deve ser Vite + React + TypeScript, com estrutura modular e lógica econômica separada dos componentes.
- [ ] O projeto deve incluir README.md com instruções mínimas de instalação, execução e build.
- [ ] O projeto deve incluir DOCUMENTACAO.md com regras, parâmetros, controles, leitura dos gráficos e limitações.
- [ ] O projeto deve incluir RELATORIO_TECNICO.md com arquitetura, decisões e demonstração do ciclo completo.
- [ ] O projeto deve servir `/manus-routes.json` com a rota `/` declarada.
- [ ] O projeto deve concluir o build a partir de instalação limpa.
- [ ] O resultado deve ser salvo em checkpoint Manus e sincronizado com `https://github.com/meshwave65/mwc-ums-sim` sem force-push, preservando conteúdo remoto.
- [ ] Credenciais não devem ser solicitadas pelo chat, incluídas no código ou gravadas em arquivo versionado.

## Fora do escopo desta versão

- [ ] Não implementar blockchain real, smart contracts, mineração, consenso, carteira, exchange, compra/venda real, pagamentos, PIX, integração bancária, autenticação, usuários reais, banco remoto, infraestrutura distribuída, nós reais, PoUW criptográfico, token público ou produção financeira.
