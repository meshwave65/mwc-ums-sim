# Etapa 04 — API independente de leitura e append

## Objetivo

Separar a autoridade da blockchain do frontend, mantendo o simulador como produtor de eventos e o webservice como criador e validador de blocos.

## Novo repositório sugerido

`meshwave65/mwc-blockchain-service`

Responsabilidades:

- receber eventos observacionais;
- definir índice, timestamp, validador e `previous_hash`;
- calcular SHA-256 no servidor;
- validar a cadeia;
- expor leitura segura;
- aplicar idempotência.

## Endpoints iniciais

```text
GET  /health
GET  /v1/chains/:chainId
GET  /v1/chains/:chainId/blocks
GET  /v1/chains/:chainId/blocks/:index
GET  /v1/chains/:chainId/validate
POST /v1/chains/:chainId/blocks
```

O cliente não deve ser autoridade para `index`, `hash`, `previous_hash`, timestamp ou validator.

## Idempotência e concorrência

Cada rodada deve enviar uma `idempotency_key`, por exemplo:

```text
MWBlockchain:simulation-id:round-42
```

O backend deve rejeitar ou retornar o bloco existente quando a mesma chave chegar novamente. Antes de anexar, deve proteger a cabeça da cadeia contra duas escritas concorrentes.

## Segurança mínima

- HTTPS;
- token de ingestão separado do token administrativo;
- validação de schema do payload;
- rate limiting básico;
- CORS restrito ao frontend;
- nenhum segredo no bundle do navegador;
- endpoint de corrupção somente em ambiente protegido.

## Testes

- append cria exatamente um bloco;
- append concorrente não cria dois índices iguais;
- repetição idempotente retorna o mesmo bloco;
- payload inválido não altera a cadeia;
- GET de validação detecta corrupção;
- health check não expõe segredos.

## Critérios de aceite

- frontend pode consultar a cadeia sem conhecer a chave privilegiada;
- o servidor é a única autoridade criptográfica;
- API possui contrato OpenAPI ou documentação equivalente;
- testes de integração usam banco efêmero ou mocks transacionais confiáveis.

## Riscos

Um serviço remoto introduz indisponibilidade e latência. O frontend deve exibir estado `offline/pending` sem inventar blocos confirmados.

## Rollback

Manter adaptador local temporário e permitir modo somente leitura. Nunca fazer fallback silencioso para criar blocos remotos falsos.
