# Laboratório de testes — MWC Storage Node

## Estado atual

- Testes unitários do agente: executados no GitHub Actions.
- Integração HTTP entre dois processos: automatizada em `scripts/two_node_integration.py`; executada no workflow `MWC VM Lab — two-node integration`.
- **Duas VMs independentes: ainda não provisionadas nem testadas.**

## Etapa 1 — Integração antes de provisionar VMs

O cenário inicia dois processos independentes do agente, com diretórios de dados, portas, identidades e tokens separados. Verifica:

1. autenticação nas rotas protegidas;
2. identidade distinta de cada nó;
3. isolamento: o nó B não tem o objeto do nó A até que o cliente o transfira explicitamente;
4. transferência explícita, recuperação dos bytes e SHA-256;
5. desafio e evidência de integridade no nó B;
6. rejeição de replay do desafio.

**Limitação:** ambos os processos executam no mesmo runner Linux hospedado pelo GitHub. Este cenário não prova isolamento de VM, independência de rede, replicação automática, tolerância a partições ou descentralização. O agente atual não implementa replicação automática nem emissão de UMS.

## Etapa 2 — Testes em VMs independentes

Após a etapa 1 passar, escolher um provedor que permita criar e destruir duas VMs sob demanda. Manter as VMs em rede privada, sem expor a API do nó à internet pública. Registrar o commit testado, configuração das VMs, logs e resultados sanitizados. Não versionar tokens ou dados sensíveis.

Matriz de VM a executar:
- comunicação entre VMs por rede privada;
- isolamento de dados e transferência explícita;
- reinicialização do processo e da VM com verificação de integridade;
- autenticação, indisponibilidade e recuperação;
- latência e falhas de rede controladas.

## Critérios de aprovação

- Resultado reproduzível e vinculado ao commit exato.
- Hash calculado sobre os bytes realmente recuperados.
- Logs sem segredos e artefatos de execução preservados.
- Não classificar testes não executados como aprovados.
- Não declarar PoUW resistente a conluio, descentralização ou replicação sem testes e mecanismos próprios.
