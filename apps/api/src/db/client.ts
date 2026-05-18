import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const libsqlClient = createClient({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(libsqlClient);
