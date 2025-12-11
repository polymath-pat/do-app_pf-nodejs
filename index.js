const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

async function testConnection() {
  const caCert = fs.readFileSync(path.join(__dirname, "do-ca.pem")).toString();

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      ca: caCert,
      rejectUnauthorized: true,   // NOW we can safely require real validation
    }
  });

  try {
    console.log("Connecting to DigitalOcean Managed Database...");
    await client.connect();
    console.log("✅ Successfully connected to DigitalOcean Managed DB!");

    const result = await client.query("SELECT NOW()");
    console.log("⏱ Database Time:", result.rows[0]);
  } catch (err) {
    console.error("❌ Connection failed:");
    console.error(err);
  } finally {
    await client.end();
    console.log("🔌 Connection closed.");
  }
}

testConnection();
