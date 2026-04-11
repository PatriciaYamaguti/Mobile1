# Backend - Gerador de Senha (Autenticacao)

## Stack usada
- Node.js
- Express
- body-parser
- cors
- jsonwebtoken
- pg
- sequelize
- Postgres (via Docker)

## Como rodar
1. Copie `.env.example` para `.env`.
2. Suba o banco:
```bash
docker compose up -d
```
3. Instale dependencias:
```bash
npm install
```
4. Rode a API:
```bash
npm run dev
```

API padrao em `http://localhost:3333`.

## Rotas

### Nao autenticadas
- `GET /signin` (conforme requisito)
- `POST /signin` (opcao adicional recomendada)
- `POST /signup`

### Autenticada
- `GET /signout` (opcional)
- `POST /passwords` (salvar senha no historico)
- `GET /passwords` (listar historico de senhas)
- `DELETE /passwords/:id` (excluir senha do historico)

## Regras de negocio implementadas
- Signup com campos: `name`, `email`, `password`, `repeatPassword`
- Valida se email ja existe
- Valida formato de email
- Valida se as senhas sao iguais
- Senha salva com hash criptografico (PBKDF2 + salt)
- Signin retorna JWT
- Historico salvo com nome do aplicativo (`appName`)
- Senha do historico salva com codificacao simples (Base64) e retornada decodificada no listar

## Exemplos de requisicoes

### POST /signup
```json
{
  "name": "Patricia",
  "email": "patricia@email.com",
  "password": "123456",
  "repeatPassword": "123456"
}
```

### GET /signin
`/signin?email=patricia@email.com&password=123456`

### POST /signin
```json
{
  "email": "patricia@email.com",
  "password": "123456"
}
```

### GET /signout
Header:
`Authorization: Bearer <token>`

### POST /passwords
Header:
`Authorization: Bearer <token>`

Body:
```json
{
  "appName": "Instagram",
  "password": "123"
}
```

### GET /passwords
Header:
`Authorization: Bearer <token>`

### DELETE /passwords/:id
Header:
`Authorization: Bearer <token>`
