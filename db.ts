import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";
import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Define the type for the briefing data
export type BriefingData = Record<string, unknown>;

// Define the briefing record type based on our schema
export type Briefing = {
  id: string;
  category: string;
  data: BriefingData;
  createdAt: Date;
  updatedAt: Date;
};

// Check if we're in a production environment
const isProduction = process.env.NODE_ENV === "production";

// Use the appropriate connection method based on environment
let db: NodePgDatabase;

if (isProduction) {
  // In production, use the Neon serverless driver
  const neonClient = neon(process.env.DATABASE_URL ?? "");
  // There's a type mismatch between Neon and Drizzle but it works at runtime
  // Using unknown as an intermediate step is safer than 'any'
  db = drizzle(neonClient as unknown as Pool);
} else {
  // In development, use the standard pg Pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  db = drizzle(pool);
}

// Define the briefings table schema as described in section 5.3
export const briefings = pgTable("briefings", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: text("category").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Helper functions for common operations

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
  const result = await db
    .insert(briefings)
    .values({
      category,
      data,
    })
    .returning();

  return (result[0] as Briefing | undefined) ?? null;
}

/**
 * Get a briefing by UUID
 * @param id The briefing UUID
 * @returns The found briefing or null
 */
export async function getBriefingById(id: string): Promise<Briefing | null> {
  const result = await db.select().from(briefings).where(eq(briefings.id, id));

  return (result[0] as Briefing | undefined) ?? null;
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
  // Use raw SQL for updating to handle the updated_at field correctly
  const result = await db.execute(
    sql`UPDATE briefings SET data = ${JSON.stringify(
      data
    )}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING *`
  );

  // Convert result to a strongly typed array
  const rows = result as unknown as Array<Record<string, unknown>>;
  return rows.length > 0 ? (rows[0] as unknown as Briefing) : null;
}

export { db };
