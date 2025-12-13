# DigitalOcean App Platform → Managed PostgreSQL Connectivity Test

This repository contains a minimal Node.js application designed to verify secure connectivity between a **DigitalOcean App Platform** service and a **DigitalOcean Managed PostgreSQL Database**.  
It includes full TLS validation using DigitalOcean’s Managed Database Certificate Authority (CA) certificate.

---

## 📦 Features

- Secure SSL/TLS connection to DigitalOcean Managed PostgreSQL
- Uses DigitalOcean's auto-injected `DATABASE_CA_CERT` environment variable
- Connection pooling for optimal performance (20-30ms handshake savings)
- No security bypass (`rejectUnauthorized: true`)
- Production-ready pool configuration with proper error handling
- Logs successful connectivity to app logs
- Works seamlessly on DigitalOcean App Platform

---

## 🚀 Deployment on DigitalOcean App Platform

### 1. Push this repository to GitHub

Fork or upload the contents of this repository to your own GitHub account.

### 2. Create an App in DigitalOcean

1. Go to **DigitalOcean → Apps → Create App**
2. Choose your GitHub repository
3. DigitalOcean will auto-detect Node.js
4. Under **Resources**, click **Add Database**
5. Select your Managed PostgreSQL cluster
   > This automatically injects `DATABASE_URL` and adds Trusted Sources.

**OR** use the included `.do/app.yaml` spec file which automatically configures everything!

### 3. Deploy (Automatic with App Spec)

Click **Deploy** and wait for the build to complete.

To verify the connection, open:

**App → Logs**

Expected output appears below.

---

## 🧪 Running the App Locally

Local testing requires your machine's IP to be added as a **Trusted Source** for your database.

### Install dependencies:

```bash
npm install
```

### Run the app:

```bash
DATABASE_URL="postgres://USER:PASSWORD@HOST:25060/defaultdb?sslmode=require" \
DATABASE_CA_CERT="$(cat /path/to/ca-certificate.crt)" \
npm start
```

Download the CA certificate from your database cluster's Overview page.

---

## 🏗️ Architecture & Best Practices

This application demonstrates DigitalOcean best practices:

- **Connection Pooling**: Uses `pg.Pool` instead of `Client` for reusing connections
- **Infrastructure as Code**: Includes `.do/app.yaml` spec file for declarative deployments
- **Automatic SSL Configuration**: CA certificate configured via app spec (no manual UI setup!)
- **Proper Error Handling**: Pool-level error listeners and client release in finally blocks
- **Production-ready Settings**: Configured with appropriate timeouts and connection limits

Notes:
* This project is intended primarily as a connectivity test or template.
* DigitalOcean automatically sets `DATABASE_URL` for App Platform services that use a linked Managed Database.
* The `.do/app.yaml` file automatically configures the `DATABASE_CA_CERT` environment variable - no manual configuration needed!
* For production apps, extend this pattern with routers, health checks, and additional middleware.
