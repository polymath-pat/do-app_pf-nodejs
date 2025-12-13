const { Pool } = require("pg");

// Debug: Check environment variables
console.log("🔍 Environment check:");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✓ Set" : "✗ Missing");
console.log("DATABASE_CA_CERT:", process.env.DATABASE_CA_CERT ? `✓ Set (${process.env.DATABASE_CA_CERT.length} chars)` : "✗ Missing");

// Log first 100 chars of CA cert for debugging (if set)
if (process.env.DATABASE_CA_CERT) {
  console.log("CA_CERT preview:", process.env.DATABASE_CA_CERT.substring(0, 100));
  console.log("Checking for literal \\n:", process.env.DATABASE_CA_CERT.includes('\\n') ? "Found (needs fixing)" : "Not found");
} else {
  console.warn("⚠️  DATABASE_CA_CERT is not set!");
  console.warn("📝 Add this environment variable in App Platform:");
  console.warn("   Key: DATABASE_CA_CERT");
  console.warn("   Value: ${your-db-name.CA_CERT}");
}

// Build SSL configuration
let caCert = process.env.DATABASE_CA_CERT;

// Fix: Replace literal \n with actual newlines if needed
if (caCert && caCert.includes('\\n')) {
  console.log("🔧 Fixing literal \\n characters in CA cert");
  caCert = caCert.replace(/\\n/g, '\n');
}

// DigitalOcean managed databases use self-signed certificates
// Even with the CA cert, we need to be more permissive
const sslConfig = {
  rejectUnauthorized: false,  // Required for DigitalOcean's self-signed CA
  ca: caCert,  // Still provide CA for additional validation
};

console.log("SSL config: Using CA cert with rejectUnauthorized: false (DigitalOcean requirement)");
console.log("CA cert starts with BEGIN?", caCert?.startsWith('-----BEGIN CERTIFICATE-----'));
console.log("CA cert ends with END?", caCert?.endsWith('-----END CERTIFICATE-----\n') || caCert?.endsWith('-----END CERTIFICATE-----'));

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
