# Deck — Supabase Auth + Storage no App Android SWE

Esta pasta contém a versão HTML do deck técnico criado no Manus Slides sobre a integração de Supabase Auth e Storage no aplicativo Android SWE e no simulador MWC/UMS.

## Conteúdo

O deck possui oito páginas, na ordem definida abaixo:

1. `capa.html` — Supabase Auth + Storage no App Android SWE;
2. `ponto_partida.html` — estado atual e evidências confirmadas;
3. `arquitetura_alvo.html` — arquitetura alvo;
4. `fluxo_auth.html` — fluxo de autenticação;
5. `fluxo_storage.html` — Storage, snapshots e caminhos determinísticos;
6. `organizacao_codigo.html` — organização do código Android;
7. `seguranca_rls.html` — segurança, Auth e RLS;
8. `plano_execucao.html` — plano de implementação e aceite.

`design.md` registra a linguagem visual e os tokens usados. `project.json` é o manifesto arquivado do deck, incluindo a ordem e os metadados das páginas. O cursor temporário da sessão do Slides não foi incluído.

## Relação com o código

O conteúdo do deck foi baseado nos repositórios:

- `meshwave65/mwc-ums-sim` — simulador, persistência, Storage Node e relatórios;
- `meshwave65/AppAndroidSWE-Start` — referência do cliente Supabase Auth/Storage existente.

Os slides são documentação técnica e não substituem os testes automatizados, as migrations ou a validação contra uma sessão Supabase real.
