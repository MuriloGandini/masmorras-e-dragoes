import { Hono } from "hono";
import { supabase } from "../lib/client";
const app = new Hono();
import { insertLevels } from "../services/levels";
import { deleteLevels } from "../services/levels";
app.delete('/', async (c) => {
  let params = c.req.query()
  const authorization = c.req.header("Authorization");
  let { data, error } = await supabase.getUser(authorization!.slice(7));
  const user_id = data.user?.id;
  try {
    return c.json(await deleteLevels({
      id: Number(params['id']!),
      character_id: Number(params['character_id']!),
      user_id: user_id!
    }))
  } catch (e) {
    return c.json(e)
  }
})

app.post("/", async (c) => {
  const body = await c.req.json();
  const authorization = c.req.header("Authorization");
  let { data, error } = await supabase.getUser(authorization!.slice(7));
  const user_id = data.user?.id;
  const class_id: number = body.class_id;
  const level: number = body.level;
  const character_id: number = body.character_id;
  return c.json(
    await insertLevels(
      { user_id: user_id!, class_id: class_id, levels: level, character_id: character_id },
      authorization!,
    ),
  );
});

export default app;