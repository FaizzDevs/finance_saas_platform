import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "ep-shy-scene-a1jwy71k-pooler.ap-southeast-1.aws.neon.tech",
    port: 5432,
    user: "neondb_owner",
    password: "npg_74FVUCaozGyK",
    database: "neondb",
    ssl: "require",
  },
} satisfies Config;
