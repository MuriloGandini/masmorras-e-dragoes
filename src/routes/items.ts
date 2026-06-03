import { Hono } from "hono";
import { supabase } from "../lib/supabase";
const app = new Hono();
import {insertItem }from '../services/items'
app.post('/', async (c) => {
  const authorization = c.req.header('Authorization');
  const body = await c.req.json();
  const { data, error } = await supabase.auth.getUser(authorization!.slice(7));
  const user_id = data.user?.id;
  const item_id: number = body.item_id;
  const character_id: number = body.character_id;
  return c.json(await insertItem({item_id: item_id, character_id: character_id, user_id: user_id!}, authorization!))
})

export default app