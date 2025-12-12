const { Pool } = require("pg");

// Debug: Check environment variables
console.log("🔍 Environment check:");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✓ Set" : "✗ Missing");
console.log("DATABASE_CA_CERT:", process.env.DATABASE_CA_CERT ? "✓ Set" : "✗ Missing");

if (!process.env.DATABASE_CA_CERT) {
  console.warn("⚠️  DATABASE_CA_CERT is not set!");
  console.warn("📝 Add this environment variable in App Platform:");
  console.warn("   Key: DATABASE_CA_CERT");
  console.warn("   Value: ${your-db-name.CA_CERT}");
}

// Create a single pool instance (reuse throughout app lifecycle)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DATABASE_CA_CERT,  // Must be configured in App Platform
  },
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
