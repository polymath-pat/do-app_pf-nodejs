# DigitalOcean App Platform → Managed DB Test

This app simply tests connectivity to a DigitalOcean Managed PostgreSQL DB.

## Environment Variables
- `DATABASE_URL` (injected automatically if attached to a DO Managed DB)

## Run locally

`npm install DATABASE_URL="postgres://user:pass@host:25060/db?sslmode=require" npm start`
