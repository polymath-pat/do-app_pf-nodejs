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

### 3. Configure Environment Variables

**IMPORTANT:** You must manually add the database CA certificate variable:

1. Go to **Settings** → **App-Level Environment Variables** (or component settings)
2. Click **Edit**
3. Add a new environment variable:
   - **Key:** `DATABASE_CA_CERT`
   - **Value:** `${db.CA_CERT}` (or `${your-db-name.CA_CERT}` if your database has a different name)
4. Click **Save**

> **Note:** Find your database component name in the **Resources** tab.

### 4. Deploy

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

### Download the CA Certificate

1. Go to **DigitalOcean → Databases**
2. Select your PostgreSQL cluster
3. On the **Overview** page, scroll to **Connection Details**
4. Click **Download CA certificate**

### Run the app with environment variables:

```bash
DATABASE_URL="postgres://USER:PASSWORD@HOST:25060/defaultdb?sslmode=require" \
DATABASE_CA_CERT="$(cat /path/to/ca-certificate.crt)" \
npm start
```

Replace `/path/to/ca-certificate.crt` with the actual path to your downloaded certificate.

---

## 🏗️ Architecture & Best Practices

This application demonstrates DigitalOcean best practices:

- **Connection Pooling**: Uses `pg.Pool` instead of `Client` for reusing connections
- **Environment-based Configuration**: Leverages `DATABASE_CA_CERT` auto-injected by App Platform
- **Proper Error Handling**: Pool-level error listeners and client release in finally blocks
- **Production-ready Settings**: Configured with appropriate timeouts and connection limits

Notes:
* This project is intended primarily as a connectivity test or template.
* DigitalOcean automatically sets `DATABASE_URL` and `DATABASE_CA_CERT` for App Platform services that use a linked Managed Database.
* For production apps, extend this pattern with routers, health checks, and additional middleware.
