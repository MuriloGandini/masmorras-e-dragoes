import { Hono } from "hono";
import { supabase } from "../lib/client";
const app = new Hono();
import { deleteItem, insertItem } from '../services/items';

app.delete('/', async (c) => {
  let params = c.req.query();
  const authorization = c.req.header('Authorization');
  const body = await c.req.json();
  const { data, error } = await supabase.getUser(authorization!.slice(7));
  const user_id = data.user?.id;
  try {
    return c.json(await deleteItem({
      id: Number(params['id']!),
      user_id: user_id!,
      character_id: Number(params['character_id']!)
    }));
  } catch(e) {
    return c.json(e);
  }
})

app.post('/', async (c) => {
  const authorization = c.req.header('Authorization');
  const body = await c.req.json();
  const { data, error } = await supabase.getUser(authorization!.slice(7));
  const user_id = data.user?.id;
  const item_id: number = body.item_id;
  const character_id: number = body.character_id;
  return c.json(await insertItem({item_id: item_id, character_id: character_id, user_id: user_id!}))
})

export default app
