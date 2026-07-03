import { Hono } from "hono";
import { supabase } from "../lib/client";
const app = new Hono();

app.post('/', async (c) => {
  const body = await c.req.json();
  const { data, error } = await supabase.signInWithPassword({
    email: body.email,
    password: body.password
  });
  if(error) return c.json({error: error.message}, 401)
  return c.json(data);
})

export default app;