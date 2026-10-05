# news-explorer-backend

API do News Explorer, projeto final do bootcamp de desenvolvimento web full-stack da TripleTen. Responsável pela autenticação de usuários e pelo armazenamento dos artigos que cada usuário salva.

## API em produção

https://api.flp-news-explorer.verymad.net

## Tecnologias

Node.js, Express, MongoDB com Mongoose, JWT para autenticação, bcryptjs para hash de senha, celebrate e Joi para validação de requisições, winston e express-winston para logs, helmet e express-rate-limit para segurança.

## Endpoints

Rotas públicas:

| Método | Rota | Descrição |
|---|---|---|
| POST | `/signup` | Cria um usuário com email, senha e nome |
| POST | `/signin` | Autentica e retorna um JWT |

Rotas protegidas, exigem o header `Authorization: Bearer <token>`:

| Método | Rota | Descrição |
|---|---|---|
| GET | `/users/me` | Retorna email e nome do usuário logado |
| GET | `/articles` | Lista os artigos salvos pelo usuário |
| POST | `/articles` | Salva um artigo |
| DELETE | `/articles/:articleId` | Remove um artigo do próprio usuário |

## Códigos de status

`200`, `201`, `400`, `401`, `403`, `404`, `409`, `500`.

## Rodando localmente

Requer Node.js e uma instância do MongoDB em `mongodb://127.0.0.1:27017`.

```bash
npm install
npm run dev
```

O servidor sobe em `http://localhost:3000`.

Em desenvolvimento não é necessário arquivo `.env`: o segredo do JWT usa um valor fixo quando `NODE_ENV` não é `production`.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia com recarregamento automático via nodemon |
| `npm start` | Inicia em modo de produção |
| `npm run lint` | Verifica o código com ESLint |

## Variáveis de ambiente

Em produção, um arquivo `.env` na raiz do projeto, fora do controle de versão:

| Variável | Descrição |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Chave secreta para assinar e verificar os tokens |

## Logs

As requisições são gravadas em `logs/request.log` e os erros em `logs/error.log`, ambos em formato JSON.
