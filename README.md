# DigitalOcean App Platform → Managed PostgreSQL Connectivity Test

This repository contains a minimal Node.js application designed to verify secure connectivity between a **DigitalOcean App Platform** service and a **DigitalOcean Managed PostgreSQL Database**.  
It includes full TLS validation using DigitalOcean’s Managed Database Certificate Authority (CA) certificate.

---

## 📦 Features

- Secure SSL/TLS connection to DigitalOcean Managed PostgreSQL  
- Includes DigitalOcean’s CA certificate (`do-ca.pem`)  
- No security bypass (`rejectUnauthorized: true`)  
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

### 3. Deploy

Click **Deploy** and wait for the build to complete.

To verify the connection, open:

**App → Logs**

Expected output appears below.

---

## 🧪 Running the App Locally

Local testing requires your machine’s IP to be added as a **Trusted Source** for your database.

Install dependencies:

```bash
npm install
```

Run the app with your database connection string:

```DATABASE_URL="postgres://USER:PASSWORD@HOST:25060/defaultdb?sslmode=require" npm start```

Notes:
* This project is intended primarily as a connectivity test or template.
* For production apps, consider structuring your application with routers, health checks, and connection pooling.
* DigitalOcean automatically sets DATABASE_URL for App Platform services that use a linked Managed Database.
