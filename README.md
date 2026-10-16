# node-api-postgres

A minimal Node 22 HTTP API (no framework) that talks to PostgreSQL.
It is a starting point for MIOSA Services and builds with Railpack without any configuration.

## Endpoints

- `GET /` returns 200 `{"name":"node-api-postgres","ok":true}`.
- `GET /health` returns 200 with the database state; 503 only when `DATABASE_URL` is set but the database cannot be reached.

## Variables

| Name | Required | Meaning |
| --- | --- | --- |
| `DATABASE_URL` | for the database features | PostgreSQL connection string, for example `postgres://user:password@host:5432/dbname` |
| `PORT` | no (default 3000) | Port to listen on; the platform sets it |

The server starts and serves `/` without `DATABASE_URL`; `/health` reports `not configured`.

## Run locally

```sh
npm install
npm start
```

## License

MIT
