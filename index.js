const { Pool } = require("pg");

// SSL configuration for DigitalOcean managed databases
// Uses CA cert from DATABASE_CA_CERT environment variable
const sslConfig = {
  rejectUnauthorized: true,  // Validate certificate against provided CA
  ca: process.env.DATABASE_CA_CERT,  // DigitalOcean's CA cert (from app spec)
};

// Create a single pool instance (reuse throughout app lifecycle)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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

async function testConnection() {
  const client = await pool.connect();

  try {
    console.log("Connecting to DigitalOcean Managed Database...");
    const result = await client.query("SELECT NOW()");
    console.log("✅ Connected successfully!");
    console.log("⏱ DB Time:", result.rows[0]);
  } catch (err) {
    console.error("❌ Connection failed:");
    console.error(err);
  } finally {
    client.release();  // Always release client back to pool
    console.log("🔌 Connection released.");
  }
}

testConnection();
