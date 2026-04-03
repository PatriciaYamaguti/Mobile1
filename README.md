# Pass Generator Monorepo

Projeto organizado em monorepo com:
- `Frontend` (React Native + Expo)
- `backend` (Node.js + Express + Sequelize + PostgreSQL)

## Estrutura

```text
pass-generator/
  Frontend/
  backend/
  docker-compose.yml
  .env.example
```

## Como rodar (forma recomendada)

1. Na raiz, copie o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Preencha no `.env` os valores sensiveis:
- `POSTGRES_PASSWORD`
- `DB_PASSWORD`
- `JWT_SECRET`

3. Suba os servicos:

```bash
docker compose up --build
```

## Endpoints e acessos

- Frontend: `http://localhost:19006`
- Backend: `http://localhost:3333`
- Health check backend: `http://localhost:3333/health`
- PostgreSQL: `localhost:5432`

## Documentacao detalhada por modulo

- Frontend: [Frontend/README.md](Frontend/README.md)
- Backend: [backend/README.md](backend/README.md)

## Seguranca

- Nao versionar `.env`
- Versionar apenas arquivos de exemplo (`.env.example`)
- Nunca subir segredos reais no GitHub
