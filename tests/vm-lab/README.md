# Laboratório de testes com VMs — MWC Storage Node

## Objetivo

Validar o agente de armazenamento em máquinas virtuais isoladas antes de aprovar a etapa e antes de qualquer expansão para participantes reais. Este diretório separa os testes de integração distribuída dos testes unitários do agente em `node-agent/` e dos testes do simulador em `tests/`.

## Estado

**Planejamento do laboratório; execução em VMs ainda não configurada.** Não assumir que testes unitários locais comprovam comportamento distribuído, disponibilidade entre máquinas ou resistência a falhas de rede.

## Pré-requisitos para iniciar

- Definir o provedor e a forma de provisionamento das VMs.
- Definir como as VMs se comunicam numa rede privada e como as credenciais são fornecidas com segurança.
- Fixar a versão/commit do agente testado e registrar configuração, sistema operacional, recursos e resultados.
- Não usar dados reais/sensíveis nem expor o agente diretamente à internet.
- Manter os nós de teste e o validador identificáveis separadamente; um nó não deve ser tratado como prova independente de seu próprio comportamento.

## Matriz inicial

| Cenário | Preparação | Evidência esperada |
|---|---|---|
| Nó único | Uma VM, armazenamento vazio | Health/status, gravar e recuperar objeto, SHA-256 igual |
| Dois nós | Duas VMs independentes | Confirmar isolamento dos dados; registrar explicitamente que replicação ainda não existe |
| Persistência | Reiniciar o processo e depois a VM | Objeto previamente confirmado continua legível e íntegro |
| Limite de disco lógico | Quota pequena e carga acima do limite | Escritas dentro da quota aceitas; excesso recusado sem corromper objetos anteriores |
| Indisponibilidade | Parar um nó durante uma operação | Falha detectada, timeout/erro registrado e recuperação após retorno; sem declarar disponibilidade automática |
| Integridade | Comparar hash enviado, recebido e relido | Divergência detectada e evidência preservada |
| Desafio/replay | Reutilizar a mesma evidência/desafio | Reutilização recusada; testar também requisições concorrentes antes de alegar proteção robusta |
| Autenticação | Token ausente ou incorreto | Operações protegidas recusadas |
| Rede degradada | Introduzir latência/perda de pacotes de forma controlada | Latência, falhas e recuperação medidas e registradas |

## Critérios de aprovação

1. Cada cenário tem resultado reproduzível, log e identificação do commit testado.
2. Integridade verificada por hash calculado sobre os bytes recuperados, não apenas por resposta declarada pelo nó.
3. Falhas e limitações são reportadas; nenhum teste não executado é marcado como aprovado.
4. Os resultados de VM são avaliados separadamente dos testes unitários.
5. Não declarar PoUW resistente a conluio, descentralização ou replicação: esses requisitos não são demonstrados por este agente V0.1.

## Organização planejada

- `README.md`: escopo, matriz e critérios de aprovação.
- `scenarios/`: cenários reproduzíveis de integração entre VMs, quando a infraestrutura estiver definida.
- `scripts/`: inicialização/limpeza segura do laboratório, sem segredos versionados.
- `results/`: relatórios sanitizados por execução; nunca incluir tokens ou dados sensíveis.

## Próximo passo

Definir o provedor e o método de provisionamento das VMs. Só então adicionar scripts executáveis adequados à infraestrutura escolhida. Até lá, este documento é o plano de testes, não evidência de execução.
