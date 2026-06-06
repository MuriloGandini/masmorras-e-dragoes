import { Hono } from "hono";
import { supabase } from "../lib/client";
import { readSpecific } from "../services/specific";
const app = new Hono();

app.get("/", async (c) => {
  const authorization = c.req.header("Authorization")!;
  const character_id = c.req.query("character_id");
  let { data, error } = await supabase.getUser(authorization.slice(7));
  const user_id = data.user?.id;
  try {
    return c.json(await readSpecific(character_id!, user_id));
  } catch (e) {
    return c.json(e);
  }
});

export default app;
