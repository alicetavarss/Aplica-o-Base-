# API Node.js (Express) com Cache em Redis e Docker
API Node.js (Express) com cache em memória (Redis), conteinerizada e orquestrada via Docker Compose.

## Initial Scenario
Inicialmente, essa API rodava de forma puramente local (`node server.js`), buscando os dados direto de variáveis simples, sem cache e sem nenhuma conexão externa.

## Code Evolution and Standardization of Infrastructure and Orchestration
O arquivo `server.js` foi atualizado para incluir a lógica de cache para duas entidades distintas (Usuários e Produtos), e a biblioteca do Redis foi instalada para permitir a comunicação com o banco em memória. O ecossistema Docker foi configurado no sistema operacional, garantindo que o serviço principal (o daemon do Docker) estivesse ativo e pronto para gerenciar os recursos. Em seguida, foi criado o arquivo `docker-compose.yml` para unificar a aplicação. Esse arquivo define a rede interna e os dois serviços isolados (  `backend-api` e  `redis-cache`), permitindo inicializar todo o ecossistema com um único comando.

## After the Process
Com a infraestrutura integrada, a API passou a responder os dados direto do banco simulado na primeira requisição (`"fonte": "banco"`) e, de forma automática, a entregar as consultas seguintes direto da memória RAM do Redis (`"fonte": "cache"`).

## Execution and Testing
Na pasta do projeto, execute o seguinte comando:

``` docker compose up ```

Acesse os endpoints no navegador para validar o fluxo:

Usuários: `http://localhost:3000/usuarios/2`
Produtos: `http://localhost:3000/produtos/2`

***Na primeira tentativa, o sistema realiza um Cache Miss, buscando o dado na fonte original e retornando "fonte": "banco". Ao atualizar a página (F5), ocorre um Cache Hit, e o Redis entrega o dado instantaneamente com "fonte": "cache". Como configuramos um TTL (Time-To-Live) de 60 segundos, se você aguardar um minuto e atualizar a página novamente, o cache expirará e o ciclo se repetirá automaticamente, garantindo que os dados não fiquem obsoletos no sistema.***
