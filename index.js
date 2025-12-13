const { Pool } = require("pg");

// Debug output (safe - no sensitive data)
console.log("=== Database Connection Debug Info ===");
console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
console.log("DATABASE_CA_CERT present:", !!process.env.DATABASE_CA_CERT);
console.log("DATABASE_CA_CERT length:", process.env.DATABASE_CA_CERT?.length || 0);

// Parse DATABASE_URL to check for conflicting SSL parameters
if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  console.log("DB Host:", url.hostname);
  console.log("DB Port:", url.port);
  console.log("DB Name:", url.pathname.substring(1));
  console.log("URL Search Params:", url.search); // Shows sslmode etc
}

// SSL configuration for DigitalOcean managed databases
const sslConfig = {
  rejectUnauthorized: true,  // Validate certificate against provided CA
  ca: process.env.DATABASE_CA_CERT,  // DigitalOcean's CA cert (from app spec)
};

console.log("SSL Config:", { rejectUnauthorized: sslConfig.rejectUnauthorized, caPresent: !!sslConfig.ca });
console.log("======================================");

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
