const { Pool } = require("pg");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

// Parse DATABASE_URL to remove conflicting SSL parameters
let cleanConnectionString = process.env.DATABASE_URL;
if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  // Remove SSL-related query parameters to avoid conflicts
  // We'll use programmatic SSL config instead
  url.search = '';
  cleanConnectionString = url.toString();
}

// SSL configuration for DigitalOcean managed databases
const sslConfig = {
  rejectUnauthorized: true,  // Validate certificate against provided CA
  ca: process.env.DATABASE_CA_CERT,  // DigitalOcean's CA cert (from app spec)
};

// Create a single pool instance (reuse throughout app lifecycle)
const pool = new Pool({
  connectionString: cleanConnectionString,
  ssl: sslConfig,
  // Optional pool configuration
  max: 20,                    // Maximum connections in pool
  idleTimeoutMillis: 30000,   // Close idle clients after 30s
  connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "DigitalOcean App Platform + Managed PostgreSQL",
    timestamp: new Date().toISOString()
  });
});

// Database connection test endpoint
app.get("/db-test", async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT NOW(), version() as pg_version");

    res.json({
      status: "success",
      message: "Database connection successful",
      data: {
        timestamp: result.rows[0].now,
        postgresVersion: result.rows[0].pg_version
      }
    });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: err.message
    });
  } finally {
    if (client) client.release();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/`);
  console.log(`🔍 Database test: http://localhost:${PORT}/db-test`);
});
