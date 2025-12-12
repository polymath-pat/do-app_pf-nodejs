# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimal Node.js application that tests secure connectivity between DigitalOcean App Platform and DigitalOcean Managed PostgreSQL databases. It demonstrates best practices for database connections using connection pooling and environment-based SSL configuration.

## Architecture

The application consists of a single entry point (`index.js`) that:
1. Creates a connection pool using the `pg` library's `Pool` class
2. Configures SSL/TLS using the auto-injected `DATABASE_CA_CERT` environment variable
3. Connects to PostgreSQL with full TLS validation
4. Executes a test query (`SELECT NOW()`)
5. Releases the connection back to the pool

**Key architectural decisions:**
- Uses `Pool` instead of `Client` for connection pooling (20-30ms handshake savings per query)
- Uses `rejectUnauthorized: true` for full TLS certificate validation
- Leverages DigitalOcean-injected environment variables (`DATABASE_URL` and `DATABASE_CA_CERT`)
- Configured with production-ready pool settings (max connections, timeouts, etc.)
- Implements proper error handling for pool-level errors

## Commands

### Run the application
```bash
npm start
```

### Install dependencies
```bash
npm install
```

### Run locally with database connection
```bash
DATABASE_URL="postgres://USER:PASSWORD@HOST:25060/defaultdb?sslmode=require" DATABASE_CA_CERT="$(cat /path/to/ca-certificate.crt)" npm start
```

Note: Download the CA certificate from your database cluster's Overview page in the DigitalOcean control panel.

## Database Connection

The application requires two environment variables:

1. **`DATABASE_URL`** - PostgreSQL connection string in the format:
   ```
   postgres://USER:PASSWORD@HOST:25060/defaultdb?sslmode=require
   ```

2. **`DATABASE_CA_CERT`** - CA certificate for TLS validation

On **DigitalOcean App Platform**, both variables are automatically injected when a Managed Database is linked to the app. This is the recommended deployment method.

For **local testing**:
- Your IP must be added as a Trusted Source in the DigitalOcean database settings
- Download the CA certificate from your database cluster's Overview page
- Set both environment variables manually

## TLS/SSL Configuration

The application uses DigitalOcean's CA certificate provided via the `DATABASE_CA_CERT` environment variable. This follows DigitalOcean's official best practice for App Platform deployments.

**Why environment variables instead of files?**
- Automatically updated by DigitalOcean when certificates rotate
- No need to commit sensitive/environment-specific files to the repository
- Works seamlessly across different database clusters
- Follows the 12-factor app methodology

The SSL configuration is in `index.js:6-9`.

## Connection Pooling

The application uses `pg.Pool` for connection pooling with the following configuration:
- **max**: 20 connections (default)
- **idleTimeoutMillis**: 30000ms (close idle clients after 30 seconds)
- **connectionTimeoutMillis**: 2000ms (fail fast if pool is exhausted)

Connection pooling is essential because each new PostgreSQL connection requires 20-30ms for SSL handshake and negotiation. Pools reuse connections, dramatically improving performance.

DigitalOcean Managed Databases provide 25 connections per 1 GiB of RAM, with 3 reserved for maintenance.
