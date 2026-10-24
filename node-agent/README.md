# MWN Storage Node Agent — laboratório V0.1

Este agente é o primeiro componente executável para testar armazenamento real em disco antes de provisionar VMs. Usa apenas a biblioteca padrão do Python 3.11+; não altera o frontend nem o esquema Supabase.

## Executar

Na raiz do repositório:

```bash
export MWC_NODE_TOKEN="$(python -c 'import secrets; print(secrets.token_urlsafe(32))')"
python node-agent/mwc_node.py --data-dir ./lab-data/node-01 --quota-mb 256 --host 127.0.0.1 --port 8787
```

O token deve ser guardado em segredo. O serviço escuta apenas em localhost por padrão. Para escutar em interface de rede, defina explicitamente `MWC_NODE_ALLOW_REMOTE=1`, use uma rede/firewall restritos e TLS ou um proxy seguro; não exponha diretamente à internet.

## Armazenar e validar um objeto

Em outro terminal, use o mesmo `MWC_NODE_TOKEN`:

```bash
curl -sS http://127.0.0.1:8787/health
printf 'MWN lab object' > /tmp/mwc-object.bin
curl -sS -X POST http://127.0.0.1:8787/v1/objects \
  -H "Authorization: Bearer $MWC_NODE_TOKEN" \
  --data-binary @/tmp/mwc-object.bin
``

Copie o valor `object_hash` da resposta e execute:

```bash
python node-agent/mwc_validator.py <SHA256_DO_OBJETO>
``

O cliente de validação solicita um desafio único, baixa o objeto real, calcula o hash e envia o resultado para verificação no nó. A evidência JSON registra hash, tamanho, nonce, timestamps e identificadores. Cada desafio só pode ser consumido uma vez.

## Testes automatizados

```bash
cd node-agent
python -m unittest -v test_mwc_node.py
```

Os testes cobrem persistência após reinício, limite de capacidade, verificação técnica e rejeição de replay.

## Endpoints

- `GET /health`: disponibilidade básica, sem autenticação.
- `GET /v1/status`: capacidade e contagem de objetos.
- `POST /v1/objects`: armazena bytes do corpo HTTP; resposta contém hash e tamanho.
- `GET /v1/objects/{sha256}`: devolve bytes reais e cabeçalho `X-Object-SHA256`.
- `POST /v1/challenges`: JSON `{"object_hash":"..."}`; emite desafio de uso único.
- `POST /v1/evidence`: JSON com `challenge_id`, `reported_hash` e `reported_size`; verifica contra os bytes lidos do disco.

Todos os endpoints, exceto `/health`, exigem `Authorization: Bearer <token>`.

## Limites desta etapa

- A verificação comprova que o nó conseguiu reler os bytes e que hash/tamanho coincidem; ainda não é um protocolo PoUW independente resistente a conluio.
- O cliente validador está separado do agente, mas o próprio nó confirma a evidência recebida. A próxima etapa deverá mover a decisão de aceitação para um validador externo independente.
- Não há replicação entre nós, integração de blockchain, emissão de UMS, orquestrador de VMs ou sincronização Supabase neste incremento.
- Não execute com dados sensíveis. Para uso remoto real, falta endurecimento de segurança e TLS adequado.
