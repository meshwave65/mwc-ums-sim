# Etapa 07 — Frontend estático, CI e deploy Render

## Objetivo

Publicar o simulador e o serviço de blockchain separadamente, com GitHub como fonte de código e CI como gate antes do deploy.

## Serviços

### Frontend

Render Static Site:

```text
Build: pnpm install --frozen-lockfile && pnpm build
Publish: dist
```

### API

Render Web Service:

```text
Build: pnpm install --frozen-lockfile && pnpm build
Start: pnpm start
```

O frontend recebe somente a URL pública da API e um identificador não secreto. A service role key do Supabase fica exclusivamente no webservice.

## GitHub Actions

Checks obrigatórios:

- install com lockfile;
- type-check;
- unit tests;
- integration tests;
- build;
- E2E;
- performance regression quando aplicável.

Configurar o Render para `After CI Checks Pass` quando os checks já estiverem disponíveis. Assim, push sem CI aprovado não publica automaticamente.

## Configuração

Variáveis do serviço:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
BLOCKCHAIN_INGEST_TOKEN
BLOCKCHAIN_ADMIN_TOKEN
NODE_ENV=production
```

O frontend deve usar variáveis públicas específicas, sem compartilhar segredos.

## Testes

- build reproduzível a partir de clone limpo;
- deploy de commit conhecido;
- health check pós-deploy;
- frontend consegue listar a cadeia;
- append e validação funcionam em ambiente de staging;
- falha de CI impede deploy.

## Critérios de aceite

- dois serviços têm responsabilidades separadas;
- cada serviço tem logs e health check;
- Render está ligado à branch correta;
- deploy depende dos checks definidos;
- rollback para último deploy saudável é documentado;
- CORS e HTTPS estão configurados.

## Riscos

Um deploy de frontend pode apontar para API incompatível. Usar versionamento de API e compatibilidade retroativa durante a transição.

## Rollback

Reverter o commit do frontend ou selecionar o último deploy saudável da API. Nunca apagar dados do Supabase como método de rollback de aplicação.
