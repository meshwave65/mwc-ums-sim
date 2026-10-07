# Relatório de otimizações sugeridas

**Projeto:** `meshwave65/mwc-ums-sim`  
**Data:** 2026-10-06  
**Escopo:** evolução segura do simulador MWC/UMS e preparação do `meshware_dynrotsimulator`

## 1. Princípio de preservação

As otimizações devem preservar a única fonte de verdade econômica: o simulador existente. Nenhuma melhoria de desempenho deve alterar silenciosamente:

- saldos UMS e BRL;
- geração e validação de UMS;
- conversão UMS → MWC;
- reconversão MWC → UMS;
- superávit e déficit;
- eventos econômicos;
- resultados determinísticos produzidos por uma mesma `seed`.

Toda alteração que mudar uma regra econômica deve ser tratada como mudança funcional explícita, não como otimização.

## 2. Otimizações imediatas de baixo risco

### 2.1 Limitar e resumir o histórico

O `history` guarda snapshots completos de usuários, exchange e totais a cada rodada. Para execuções longas, recomenda-se:

- limitar o histórico visual a um número configurável de snapshots;
- manter snapshots completos em intervalos maiores, por exemplo a cada 10 ou 25 rodadas;
- armazenar deltas entre snapshots intermediários;
- separar estado atual, histórico visual resumido e dados brutos exportáveis;
- preservar um modo de histórico completo para análises específicas.

A compactação deve preservar exatamente o estado final e os pontos necessários para os gráficos.

### 2.2 Evitar reconstruir a MWBlockchain a cada renderização

A blockchain observadora não deve recalcular todos os hashes sempre que o React renderizar. Recomenda-se:

- criar um bloco operacional uma única vez ao final de cada rodada;
- guardar a cadeia observadora em estado próprio;
- recalcular apenas o bloco recém-criado;
- reconstruir toda a cadeia somente durante reset, restauração ou validação explícita;
- manter os dados econômicos exclusivamente no simulador.

### 2.3 Reduzir clonagens e percursos repetidos

O motor pode evoluir para:

- calcular deltas de cada usuário durante a própria rodada;
- evitar percorrer repetidamente as mesmas listas;
- separar dados temporários da rodada dos dados persistidos;
- clonar apenas estruturas realmente alteradas;
- manter imutabilidade nos limites necessários para o React.

### 2.4 Separar eventos econômicos do log visual

Recomenda-se separar:

- eventos completos produzidos pelo motor;
- eventos recentes exibidos no painel;
- eventos enviados à MWBlockchain;
- eventos exportáveis para auditoria.

Assim, o painel pode mostrar somente os últimos registros sem descartar dados necessários para auditoria ou blockchain.

### 2.5 Desacoplar execução e atualização visual

Para 1.000 ou 10.000 rodadas:

- executar a simulação em lotes;
- atualizar a interface a cada N rodadas;
- usar `requestAnimationFrame` para atualizações visuais;
- permitir execução acelerada sem renderizar todos os estados intermediários;
- manter o modo passo a passo para inspeção.

## 3. Preparação do `meshware_dynrotsimulator`

### 3.1 Modelo explícito de nós

```ts
interface MeshNode {
  id: string
  position: { x: number; y: number }
  claId: string
  cpaId: string
  connections: string[]
  mobilityProfile: string
}
```

Isso permite representar posição, CLA atual, CPA correspondente, conexões e mobilidade.

### 3.2 CPA geolocalizado

```ts
interface CPA {
  id: string
  region: { x: number; y: number; width: number; height: number }
  claIds: string[]
  nodeIds: string[]
}
```

A busca deve seguir a cadeia:

```text
requisição → CPA local → CLA provável → nós candidatos → rota
```

Para a primeira versão, uma grade espacial simples é preferível a uma estrutura complexa.

### 3.3 Atualização imediata do cache CLA/CPA

Quando um nó muda de CLA:

```text
nó muda de CLA
→ cache do nó é atualizado
→ CLA antiga é atualizada
→ CLA nova é atualizada
→ CPA afetado é atualizado
→ rotas dependentes são invalidadas
```

Não é necessário atualizar toda a rede.

### 3.4 TTL contado em etapas

```ts
interface RouteCacheEntry {
  destinationCla: string
  nextHop: string
  createdAtStep: number
  expiresAtStep: number
}
```

O TTL deve ser contado em etapas da simulação, sem introduzir latência real na primeira versão.

## 4. Parâmetros configuráveis

| Grupo | Parâmetros |
|---|---|
| Rede | raio de conexão nó a nó |
| Rede | número máximo de conexões por etapa |
| Mobilidade | perfil, velocidade e padrão de deslocamento |
| Espaço | tamanho da grade de CPAs |
| Espaço | quantidade de CLAs por CPA |
| População | usuários por CLA |
| Cache | TTL das entradas |
| Simulação | número de etapas |
| Simulação | `seed` determinística |
| Roteamento | estratégia de seleção do próximo salto |
| Visualização | intervalo de atualização da interface |

A `seed` deve permitir repetir exatamente o mesmo cenário para comparação entre versões.

## 5. Estratégias de roteamento

Implementar primeiro estratégias comparáveis e simples:

1. **Baseline:** seleção simples de um nó elegível.
2. **Geolocalizada:** prioriza mesma CLA, mesmo CPA, menor distância e menor número estimado de saltos.
3. **Cache preditivo:** usa histórico, posição, mobilidade prevista e TTL.

Comparar taxa de sucesso, saltos médios, requisições não atendidas, cache hits, cache misses, rotas recalculadas e custo computacional.

## 6. Instrumentação

Antes de otimizar agressivamente, medir:

- tempo médio por etapa;
- tempo do roteamento;
- tempo de atualização do cache;
- buscas completas;
- cache hits e misses;
- rotas recalculadas;
- tamanho das tabelas de cache;
- memória aproximada do histórico;
- tempo de criação e validação da MWBlockchain;
- quantidade de atualizações visuais.

As métricas de rede devem permanecer separadas das métricas econômicas.

# Estratégia de testes automatizados

## 7. Estrutura de testes

```text
tests/
├── unit/
│   ├── engine.test.ts
│   ├── blockchain.test.ts
│   ├── history.test.ts
│   └── events.test.ts
├── integration/
│   ├── simulation-flow.test.ts
│   └── blockchain-flow.test.ts
├── performance/
│   ├── round.bench.ts
│   ├── history.bench.ts
│   └── blockchain.bench.ts
├── fixtures/
│   ├── seed-001.json
│   └── expected-round-10.json
└── helpers/
    └── simulation-fixtures.ts
```

Para o futuro `meshware_dynrotsimulator`:

```text
tests/routing/
├── cpa-cache.test.ts
├── cla-cache.test.ts
├── mobility.test.ts
├── ttl.test.ts
└── route-selection.test.ts
```

## 8. Testes unitários prioritários

### Motor

Validar estado inicial, progressão de rodada, coerência dos totais, ausência de saldos indevidamente negativos e reprodutibilidade com `seed` fixa.

### Preservação econômica

Criar fixtures de referência e comparar, em rodadas selecionadas:

- UMS por usuário;
- BRL;
- MWC disponível, gerado e reconvertido;
- serviços executados e não atendidos;
- UMS reconhecida e rejeitada;
- eventos relevantes.

### Histórico

Testar que a compactação não ultrapassa o limite visual e que o estado final permanece idêntico ao modo de histórico completo.

### MWBlockchain

Validar:

- Chain 0 e `machine_anchor` com SHA-256 válido;
- 64 zeros em `previous_hash` da gênese;
- Chains 1–10 com usuários e snapshots reais;
- Chain 11 com estado real inicial da exchange;
- exatamente um bloco por rodada;
- hashes e encadeamento;
- detecção de corrupção;
- restauração para `CHAIN VALID`.

A âncora de máquina deve ser validada por formato, tamanho e presença, não por igualdade entre máquinas diferentes.

## 9. Testes de propriedade

Com testes baseados em propriedades, verificar que:

- nenhuma UMS fica negativa;
- índices de blocos não se repetem;
- `previous_hash` aponta sempre para o bloco anterior;
- blocos operacionais não excedem o número de rodadas;
- um nó não pertence simultaneamente a duas CLAs;
- CPAs não referenciam CLAs inexistentes;
- TTL nunca fica negativo;
- rotas expiradas não são usadas sem renovação.

## 10. Testes de desempenho

Estabelecer uma baseline antes de impor limites. Medir 100 e 1.000 rodadas, geração da blockchain, validação da cadeia, memória do histórico e execução do roteamento.

O CI pode considerar regressão acima de aproximadamente 20% como falha, evitando limites excessivamente sensíveis a variações do runner.

## 11. Testes E2E com Playwright

O fluxo mínimo deve:

1. abrir a aplicação;
2. confirmar Chain 0 e Chain 11;
3. iniciar e pausar a simulação;
4. confirmar blocos `ROUND_n`;
5. simular corrupção;
6. confirmar `CHAIN CORRUPTED`;
7. restaurar;
8. confirmar `CHAIN VALID`.

Adicionar `data-testid` aos controles e ao status da cadeia para evitar dependência de texto ou posição visual.

## 12. GitHub Actions

Workflows recomendados:

- `ci.yml`: instalação, type-check, build, unitários e integração;
- `e2e.yml`: Playwright com Chromium;
- `performance.yml`: benchmarks em `main` e execução manual.

Checks obrigatórios para `main`:

```text
build
unit-tests
integration-tests
e2e
performance-regression
```

## 13. Golden tests

Versionar fixtures determinísticas como:

```text
tests/fixtures/
├── seed-default-round-0.json
├── seed-default-round-1.json
├── seed-default-round-10.json
└── seed-routing-100.json
```

Se uma otimização alterar um resultado econômico, o teste deve falhar. A fixture só deve ser atualizada quando a mudança de regra for intencional, revisada e documentada.

## 14. Ordem recomendada de implementação

1. Base de testes com Vitest e CI.
2. Fixtures determinísticas e golden tests econômicos.
3. Testes da MWBlockchain.
4. Limite e compactação do histórico.
5. Separação de eventos completos e log visual.
6. Cadeia incremental sem reconstrução a cada render.
7. Instrumentação de desempenho.
8. Playwright e testes E2E.
9. Modelo de nós, CLAs e CPAs.
10. Cache geolocalizado, atualização imediata e TTL.
11. Estratégias de roteamento baseline e geolocalizada.
12. Cache preditivo e comparação de métricas.

## 15. Política de aceitação

Nenhuma otimização deve ser aceita se alterar o resultado econômico determinístico sem uma decisão explícita de mudança de regra. Cada pull request deve declarar:

- qual gargalo foi medido;
- qual comportamento foi preservado;
- quais testes foram adicionados ou atualizados;
- qual foi o impacto de desempenho;
- quais limitações permanecem.
