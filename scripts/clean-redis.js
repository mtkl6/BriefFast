// Script to clean the Redis database for a fresh start
const { createClient } = require("redis");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Try to load from .env, and if that doesn't exist, try .env.local
if (fs.existsSync(path.resolve(process.cwd(), ".env"))) {
  dotenv.config();
} else if (fs.existsSync(path.resolve(process.cwd(), ".env.local"))) {
  dotenv.config({ path: ".env.local" });
  console.log("Loaded environment from .env.local");
}

// Check if we have a Redis URL
const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  console.error(
    "Missing REDIS_URL environment variable. Please check your .env or .env.local file."
  );
  process.exit(1);
}

async function cleanRedisDatabase() {
  const client = createClient({ url: REDIS_URL });

  // Set up event handlers
  client.on("error", (err) => {
    console.error("Redis Client Error:", err);
    process.exit(1);
  });

  try {
    console.log("Connecting to Redis...");
    await client.connect();

    console.log("Connected to Redis. Flushing database...");

    // Flush all keys in the database
    const result = await client.flushAll();

    console.log(`Database flushed: ${result}`);

    // Double-check by getting all keys
    const keys = await client.keys("*");
    console.log(`Keys remaining in database: ${keys.length}`);

    console.log("Redis database has been successfully cleaned!");
  } catch (error) {
    console.error("Error cleaning Redis database:", error);
  } finally {
    // Close the connection
    await client.quit();
  }
}

// Run the clean function
cleanRedisDatabase();
