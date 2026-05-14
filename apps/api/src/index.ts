import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { createTodoSchema } from "@repo/shared";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db/client";
import { todos } from "./db/schema";
import { auth } from "./lib/auth";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);

app.on(["GET", "POST"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

const routes = app
  .get("/api/health", (c) => {
    return c.json({ ok: true });
  })
  .get("/api/todos", async (c) => {
    const result = await db.select().from(todos);
    return c.json(result);
  })
  .post("/api/todos", zValidator("json", createTodoSchema), async (c) => {
    const input = c.req.valid("json");

    const result = await db
      .insert(todos)
      .values({
        title: input.title,
      })
      .returning();

    return c.json(result[0], 201);
  })
  .patch("/api/todos/:id/toggle", async (c) => {
    const id = Number(c.req.param("id"));

    const [todo] = await db.select().from(todos).where(eq(todos.id, id));

    if (!todo) {
      return c.json({ message: "Todo not found" }, 404);
    }

    const result = await db
      .update(todos)
      .set({
        done: !todo.done,
      })
      .where(eq(todos.id, id))
      .returning();

    return c.json(result[0]);
  });

export type AppType = typeof routes;

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`API server is running on http://localhost:${info.port}`);
  },
);
