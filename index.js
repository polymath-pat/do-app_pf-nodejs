const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

async function testConnection() {
  const ca = fs.readFileSync(path.join(__dirname, "do-ca.pem")).toString();

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      ca,
      rejectUnauthorized: true,  // because now we provide the CA
    }
  });

  try {
    console.log("Connecting to DigitalOcean Managed Database...");
    await client.connect();
    console.log("✅ Connected successfully!");

    const result = await client.query("SELECT NOW()");
    console.log("⏱ DB Time:", result.rows[0]);
  } catch (err) {
    console.error("❌ Connection failed:");
    console.error(err);
  } finally {
    await client.end();
    console.log("🔌 Connection closed.");
  }
}

testConnection();
