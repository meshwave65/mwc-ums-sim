# MWC / UMS Simulator

Protótipo visual em **Vite + React + TypeScript** para observar, em memória, o ciclo econômico simplificado do ecossistema MeshWave: serviços em UMS, validação PoUW, geração de capacidade, conversão em MWC, mercado externo e reconversão de MWC em UMS.

> **Importante:** este projeto é uma simulação educacional. UMS, MWC e BRL são números de um modelo local e não representam moeda, investimento, pagamento ou operação financeira real.

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

## Como usar

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
- `public/manus-routes.json`: manifesto de rota `/` exigido pelo Webdev.
- `DOCUMENTACAO.md`: regras e leitura dos painéis.
- `RELATORIO_TECNICO.md`: decisões de arquitetura, limitações e evidências.

## Regras centrais

- 10 usuários começam com 10.000 UMS e R$ 0,00.
- O mercado começa com 0 MWC e R$ 0,00.
- 1.000 UMS = 1 MWC = R$ 1,00.
- MWC não é saldo interno do usuário: usuários exibem UMS e BRL.
- Perfis positivos tendem a gerar excedente; perfis negativos tendem a consumir mais capacidade.
- Operações validadas pelo PoUW reconhecem UMS. Operações inválidas permanecem no histórico, sem reconhecimento definitivo.
- Blocos completos de UMS acima do nível inicial geram MWC.
- Déficit de capacidade tenta usar uma unidade inteira de MWC disponível; se não houver reserva, a operação fica não atendida.

## Persistência e limitações conhecidas

O simulador continua sendo a fonte dos eventos econômicos. Quando o Supabase público está configurado, o estado da MWBlockchain é convertido em itens idempotentes na fila IndexedDB para as tabelas `mw_chain_metadata`, `mw_blocks`, `mw_transactions` e `mw_state_snapshots`. O painel só informa confirmação depois de uma resposta positiva do Supabase.

A persistência remota exige uma sessão `authenticated` compatível com as políticas RLS existentes. O painel usa o mesmo fluxo do AppAndroidSWE-Start: consulta `clients` por e-mail ou nome de usuário e chama `signInWithPassword`. Após o login, snapshots também são enviados ao bucket `sofia_storage_user` em `mwc-ums/mwc-ums-simulator-v1/snapshots/<block>.json`, com `upsert` idempotente.

Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` — ou a chave legada `VITE_SUPABASE_ANON_KEY` — em `.env.local`; nunca use `service_role` no navegador. Sem essa configuração ou sem login, o painel informa que a persistência não foi confirmada; não há fallback que simule sucesso. A recuperação completa do estado econômico a partir de snapshots remotos e o append transacional entre tabelas ainda são etapas posteriores.
