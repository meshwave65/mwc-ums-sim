# MWN / UMS Simulator

Protótipo visual em **Vite + React + TypeScript** para observar, em memória, o ciclo econômico simplificado do ecossistema MeshWave: serviços em UMS, validação PoUW, geração de capacidade, conversão em MWN, mercado externo e reconversão de MWN em UMS.

> **Importante:** este projeto é uma simulação educacional. UMS, MWN e BRL são números de um modelo local e não representam moeda, investimento, pagamento ou operação financeira real.

## Executar localmente

Requisitos: Node.js 22+ e pnpm 11+.

```bash
pnpm install
pnpm dev
```

Abra o endereço indicado pelo Vite. Para validar o build:

```bash
pnpm build
pnpm preview
```

## Protótipo de nó de armazenamento

Com o servidor Vite em execução, abra [`/storage-node.html`](./public/storage-node.html). A tela permite configurar a reserva, persistir objetos localmente, calcular/verificar SHA-256 e registrar o histórico. A seção **Rede compartilhada** autentica o participante com a conta Supabase, envia os objetos locais para o bucket privado `mwc-storage-objects` e permite listar/baixar objetos remotos com verificação de hash. A sincronização exige conexão e sessão autenticada; sem isso, o armazenamento local continua funcionando.

**Limites atuais:** esta é a primeira integração de armazenamento compartilhado, não um agente distribuído completo. A disponibilidade remota depende do Supabase e de autenticação; ainda não há replicação automática entre nós, blockchain distribuída, validação PoUW nem emissão de UMSs. Nenhum crédito é simulado. O escopo congelado está em [network/projects/mwc/blueprints/PROTOTIPO_ARMAZENAMENTO_VOLUNTARIO_V0.md](https://github.com/meshwave65/network/blob/main/projects/mwc/blueprints/PROTOTIPO_ARMAZENAMENTO_VOLUNTARIO_V0.md).

## Agente executável de armazenamento — laboratório V0.1

A pasta [`node-agent/`](./node-agent/README.md) contém um serviço Python executável para laboratório controlado: armazenamento persistente em disco por SHA-256, limite de capacidade, recuperação de bytes, desafios únicos e evidências JSON. O cliente `mwc_validator.py` baixa o objeto e verifica o conteúdo. O serviço exige token bearer; escuta em localhost por padrão.

Para instruções de execução, endpoints, limites e testes, consulte [`node-agent/README.md`](./node-agent/README.md). Os testes automatizados também são executados pelo workflow [MWN Storage Node tests](./.github/workflows/mwc-node-agent-tests.yml).

**Limite importante:** esta é uma verificação técnica de integridade, não uma validação PoUW independente resistente a conluio. Não há replicação entre nós, orquestrador de VMs, blockchain ou emissão de UMS. O esquema Supabase existente permanece inalterado por este incremento.

## Como usar o simulador econômico

1. Pressione **Iniciar**.
2. Observe a tabela de usuários, os KPIs, o mercado externo, os gráficos e o log.
3. Use **Pausar**, **Continuar**, **Parar** e **Resetar** para controlar o ciclo.
4. Selecione a velocidade e o limite de rodadas; `∞ infinito` continua até Parar.
5. Abra **Parâmetros do protótipo** para ajustar valores, perfis, demanda, custos e seed. Use **Aplicar e resetar** para iniciar uma nova execução com a configuração.
6. Ao parar ou atingir o limite, use **CSV** ou **JSON** no relatório final.

## Estrutura principal

- `src/simulation/engine.ts`: execução pura de uma rodada, PoUW, saldos, conversões e eventos.
- `src/simulation/defaults.ts`: usuários, serviços, demanda e parâmetros iniciais.
- `src/simulation/types.ts`: contrato de dados do simulador.
- `src/simulation/report.ts`: consolidação do relatório final.
- `src/components/`: dashboard, controles, tabela, mercado, log, gráficos, relatório e configuração.
- `src/persistence/auth/`: sessão Supabase persistente e login compatível com `clients` do AppAndroidSWE-Start.
- `src/persistence/sync/`: fila IndexedDB, retries e mapeamento idempotente para as tabelas `mw_*` do Supabase.
- `src/styles/global.css`: linguagem visual responsiva e estados.
- `public/storage-node.html`: interface do nó de armazenamento V0, com persistência local e sincronização remota autenticada.
- `node-agent/`: serviço executável de armazenamento e cliente de validação técnica.
- `supabase/migrations/20261022000000_create_mwc_storage_v0.sql`: esquema RLS e bucket privado dedicados ao armazenamento MWN.
- `public/manus-routes.json`: manifesto de rota `/` exigido pelo Webdev.
- `DOCUMENTACAO.md`: regras e leitura dos painéis.
- `RELATORIO_TECNICO.md`: decisões de arquitetura, limitações e evidências.

## Regras centrais

- 10 usuários começam com 10.000 UMS e R$ 0,00.
- O mercado começa com 0 MWN e R$ 0,00.
- 1.000 UMS = 1 MWN = R$ 1,00.
- MWN não é saldo interno do usuário: usuários exibem UMS e BRL.
- Perfis positivos tendem a gerar excedente; perfis negativos tendem a consumir mais capacidade.
- Operações validadas pelo PoUW reconhecem UMS. Operações inválidas permanecem no histórico, sem reconhecimento definitivo.
- Blocos completos de UMS acima do nível inicial geram MWN.
- Déficit de capacidade tenta usar uma unidade inteira de MWN disponível; se não houver reserva, a operação fica não atendida.

## Persistência e limitações conhecidas

O simulador continua sendo a fonte dos eventos econômicos. Quando o Supabase público está configurado, o estado da MWBlockchain é convertido em itens idempotentes na fila IndexedDB para as tabelas `mw_chain_metadata`, `mw_blocks`, `mw_transactions` e `mw_state_snapshots`. O painel só informa confirmação depois de uma resposta positiva do Supabase.

A persistência remota exige uma sessão `authenticated` compatível com as políticas RLS existentes. O painel usa o mesmo fluxo do AppAndroidSWE-Start: consulta `clients` por e-mail ou nome de usuário e chama `signInWithPassword`. Após o login, snapshots também são enviados ao bucket `sofia_storage_user` em `mwc-ums/mwc-ums-simulator-v1/snapshots/<block>.json`, com `upsert` idempotente.

Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` — ou a chave legada `VITE_SUPABASE_ANON_KEY` — em `.env.local`; nunca use `service_role` no navegador. Sem essa configuração ou sem login, o painel informa que a persistência não foi confirmada; não há fallback que simule sucesso. A recuperação completa do estado econômico a partir de snapshots remotos e o append transacional entre tabelas ainda são etapas posteriores.
