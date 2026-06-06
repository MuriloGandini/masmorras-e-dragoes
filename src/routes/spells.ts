import { Hono } from "hono";
import { supabase } from "../lib/client";
const app = new Hono();
import { readSpells, removeSpell } from "../services/spells";
import { addSpell } from "../services/spells";
app.get("/", async (c) => {
    const authorization = c.req.header("Authorization")!;
    const character_id = Number(c.req.query("character_id"));
    let { data, error } = await supabase.getUser(authorization.slice(7));
    let id: string = data.user?.id!;
    return c.json(await readSpells(id, character_id));
});

app.post('/', async (c) => {
  const authorization = c.req.header("Authorization")!;
  const body = await c.req.json();
  let { data, error } = await supabase.getUser(authorization.slice(7));
  let id: string = data.user?.id!;
  return c.json(await addSpell({user_id: id, character_id: body.character_id, spell_id: body.spell_id}))
})

app.delete('/', async (c) => {
  const authorization = c.req.header("Authorization")!;
  const body = await c.req.json();
  let { data, error } = await supabase.getUser(authorization.slice(7));
  let id: string = data.user?.id!;
  return c.json(await removeSpell({ user_id: id, character_id: body.character_id, spell_id: body.spell_id }));
})

export default app;
