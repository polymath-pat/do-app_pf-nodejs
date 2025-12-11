const { Client } = require("pg");

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      require: true,
      rejectUnauthorized: false
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

