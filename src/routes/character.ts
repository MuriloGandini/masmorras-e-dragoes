import { Hono } from "hono";
import { createCharacter } from "../services/character";
import { PrismaClient } from "../generated/prisma/client";
import { createClient } from "@supabase/supabase-js";
const app = new Hono();

app.post("/", async (c) => {
  let body = await c.req.json();
  const authorization = c.req.header("Authorization")!;
  const supabaseAuthenticated = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { global: { headers: { Authorization: authorization } } },
  );
  let { data, error } = await supabaseAuthenticated.auth.getUser(authorization.slice(7));
  let id: string = data.user?.id!;
  try {
    return c.json(await createCharacter(id, body, authorization));
  } catch (e) {
    return c.json(e);
  }
});

export default app;
