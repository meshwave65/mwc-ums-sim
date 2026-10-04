# Relatório técnico — Simulador Econômico MWC / UMS

## 1. Resumo executivo

Foi implementado um protótipo frontend em Vite, React e TypeScript para tornar observável a economia mínima descrita no prompt MeshWave. O sistema é autocontido, roda em memória no navegador e tem como prioridade mostrar funcionamento, visualização e interação antes de qualquer sofisticação econômica.

A solução mantém a separação estrutural entre o ecossistema interno e o mercado externo. O usuário é representado por UMS e BRL. O MWC aparece somente na reserva de mercado e nos eventos de conversão/reconversão.

## 2. Arquitetura

```text
React App
├── App.tsx
│   ├── controles e intervalo de execução
│   ├── estado da simulação
│   └── composição das áreas do dashboard
├── components/
│   ├── observabilidade: KPIs, tabela, log e gráficos
│   ├── fluxo: CycleFlow e MarketPanel
│   ├── operação: SimulationControls e ConfigPanel
│   └── fechamento: FinalReport
└── simulation/
    ├── defaults.ts  → estado inicial e parâmetros
    ├── random.ts    → seed e variação limitada
    ├── engine.ts    → função runRound
    ├── selectors.ts → estados derivados e rótulos
    └── report.ts    → consolidação final
```

Não foi criado backend porque o prompt pede simulação local, sem banco, autenticação ou infraestrutura distribuída. O projeto gerenciado fornece Preview e versionamento, mas o domínio econômico permanece no frontend.

## 3. Motor de rodada

`runRound(state, config)` recebe um estado imutável e devolve outro estado. A distribuição de demanda calcula fatores a partir do perfil e de um jitter limitado. Para cada usuário, o motor calcula custo de utilização, geração bruta, validação PoUW e geração reconhecida.

A ordem contábil da rodada é:

1. alocar demanda;
2. reservar/reconverter capacidade caso o saldo seja insuficiente;
3. debitar utilização efetiva;
4. reconhecer geração validada;
5. classificar o estado do usuário;
6. converter blocos completos acima do nível inicial;
7. atualizar o mercado e os totais;
8. salvar snapshot e eventos.

O motor usa `Math.ceil` para pedir unidades inteiras de MWC e nunca fabrica frações. Se não houver reserva suficiente, calcula a parcela não atendida e mantém o fato auditável no estado.

## 4. Estado e histórico

Cada usuário mantém saldo atual e acumulados de serviços executados, serviços não atendidos, UMS geradas, UMS utilizadas, PoUW validado/rejeitado, MWC criado/usado e UMS não atendida. O mercado mantém MWC disponível, total gerado, total reconvertido, BRL de referência e volume movimentado.

Após cada rodada, um snapshot completo é adicionado à série temporal. Essa série abastece os gráficos sem depender de uma API ou de dados derivados difíceis de reproduzir. A capacidade reconhecida é calculada sobre a parte efetivamente executada: uma operação não atendida não gera UMS, não gera MWC e recebe evento explícito no log.

## 5. PoUW simplificado

Não há hash, consenso ou rede. A validação é uma taxa didática controlada. A geração bruta recebe uma pequena variação; a validação transforma somente a parte reconhecida em UMS definitiva. O log registra tanto UMS reconhecida quanto a parcela rejeitada, tornando explícito que execução e reconhecimento não são a mesma coisa.

## 6. Relatório final

Ao parar ou atingir o alvo de rodadas, `createFinalReport` ordena os usuários por UMS, preserva totais do mercado e cria uma narrativa objetiva: serviços solicitados/executados/não atendidos, UMS reconhecida/rejeitada, MWC disponível/reconvertido, BRL movimentado, usuários que usaram o mercado, usuários em déficit e maior saldo. A interface acrescenta barras comparativas de UMS, uma visualização dedicada de BRL positivo/negativo, tabela detalhada e downloads JSON/CSV.

## 7. Interface

A direção visual é um dashboard de observabilidade: base azul-petróleo escura, ciano para o ecossistema, âmbar para o mercado e coral/verde para déficit/superávit. O layout não simula uma exchange; enfatiza fluxo, telemetria, unidades e auditoria. A faixa de ciclo é responsiva, o log usa eventos coloridos e os gráficos usam SVG para evitar dependência de infraestrutura de chart pesada.

O `public/manus-routes.json` declara a única rota `/`, permitindo que o Preview e o Webdev reconheçam a entrada do dashboard.

## 8. Validação realizada

- Dependências instaladas com `pnpm install` usando política `allowBuilds` explícita para `esbuild`.
- Diagnósticos gerenciados registrados para TypeScript, JavaScript, JSON e CSS.
- `pnpm build` concluído com `tsc -b` e `vite build`.
- `pnpm ignored-builds` executado após a instalação.
- Servidor Vite iniciado em `0.0.0.0:3000`.
- `GET /` retornou o HTML do dashboard.
- `GET /manus-routes.json` retornou JSON válido com a rota `/`.
- Screenshot do Preview confirmou cabeçalho, fluxo, controles, KPIs, tabela de usuários, painel de mercado, log, gráficos vazios, relatório e configuração.

## 9. Limitações e próximos refinamentos

A primeira versão não persiste o estado e não oferece autenticação ou backend. A taxa PoUW é um parâmetro didático; o preço MWC não varia. Próximos refinamentos podem adicionar cenários de demanda, comparação entre seeds, replay de uma execução e persistência local opcional, mas isso deve ocorrer somente após observar o comportamento do modelo atual.
