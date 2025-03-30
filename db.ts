import { createClient, type RedisClientType } from "redis";
import "dotenv/config";

// Define the type for the briefing data
export type BriefingData = Record<string, unknown>;

// Define the briefing record type
export type Briefing = {
  id: string;
  category: string;
  data: BriefingData;
  createdAt: Date;
  updatedAt: Date;
};

// Check if we have a Redis URL, default to localhost if not provided
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Initialize the Redis client
let redisClient: RedisClientType;

const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient({ url: REDIS_URL });

    // Set up event handlers
    redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
    });

    // Connect to Redis
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  }

  return redisClient;
};

/**
 * Create a new briefing
 * @param category The briefing category
 * @param data The briefing data
 * @returns The created briefing
 */
export async function createBriefing(
  category: string,
  data: BriefingData
): Promise<Briefing | null> {
  try {
    const client = await getRedisClient();

    // Generate a UUID for the new briefing
    const id = crypto.randomUUID();
    const now = new Date();

    // Create the briefing object
    const briefing: Briefing = {
      id,
      category,
      data,
      createdAt: now,
      updatedAt: now,
    };

    // Save to Redis as a hash
    await client.hSet(`brief:${id}`, {
      id,
      category,
      data: JSON.stringify(data),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    // Add to category index
    await client.sAdd(`category:${category}`, `brief:${id}`);

    // Add to time-sorted index
    await client.zAdd("briefs:by_time", {
      score: now.getTime(),
      value: `brief:${id}`,
    });

    return briefing;
  } catch (error) {
    console.error("Error creating briefing:", error);
    return null;
  }
}

/**
 * Get a briefing by UUID
 * @param id The briefing UUID
 * @returns The found briefing or null
 */
export async function getBriefingById(id: string): Promise<Briefing | null> {
  try {
    const client = await getRedisClient();

    // Get the briefing hash
    const briefingData = await client.hGetAll(`brief:${id}`);

    // If no data was found, return null
    if (!Object.keys(briefingData).length) {
      return null;
    }

    // Parse the JSON data and timestamps
    const parsedData = JSON.parse(briefingData.data ?? "{}");
    const createdAt = new Date(
      briefingData.createdAt ?? new Date().toISOString()
    );
    const updatedAt = new Date(
      briefingData.updatedAt ?? new Date().toISOString()
    );

    return {
      id: briefingData.id,
      category: briefingData.category,
      data: parsedData,
      createdAt,
      updatedAt,
    };
  } catch (error) {
    console.error("Error getting briefing:", error);
    return null;
  }
}

/**
 * Update a briefing
 * @param id The briefing UUID
 * @param data The updated briefing data
 * @returns The updated briefing or null
 */
export async function updateBriefing(
  id: string,
  data: BriefingData
): Promise<Briefing | null> {
  try {
    const client = await getRedisClient();

    // Check if the briefing exists
    const exists = await client.exists(`brief:${id}`);
    if (!exists) {
      return null;
    }

    // Get the current briefing data
    const currentBriefing = await getBriefingById(id);
    if (!currentBriefing) {
      return null;
    }

    // Update only the data and updatedAt fields
    const now = new Date();

    // Update Redis hash
    await client.hSet(`brief:${id}`, {
      data: JSON.stringify(data),
      updatedAt: now.toISOString(),
    });

    // Return the updated briefing
    return {
      ...currentBriefing,
      data,
      updatedAt: now,
    };
  } catch (error) {
    console.error("Error updating briefing:", error);
    return null;
  }
}

// Function to cleanly shut down the Redis client
export async function closeRedisConnection() {
  if (redisClient?.isOpen) {
    await redisClient.quit();
  }
}

// Export the redis client for direct access if needed
export { redisClient as redis };
