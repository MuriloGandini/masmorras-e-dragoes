import { Hono } from "hono";
import { createCharacter } from "../services/character";
import { supabase } from "../lib/prisma";
const app = new Hono();

app.post("/", async (c) => {
  let body = await c.req.json();
  const authorization = c.req.header("Authorization")!;
  let { data, error } = await supabase.getUser(authorization.slice(7));
  let id: string = data.user?.id!;
  try {
    return c.json(await createCharacter(id, body, authorization));
  } catch (e) {
    return c.json(e);
  }
});

export default app;
