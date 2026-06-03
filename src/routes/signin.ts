import { Hono } from "hono";
import { supabase } from "../lib/supabase";
import type { AuthResponse } from "@supabase/supabase-js";
const app = new Hono();

app.post('/', async (c) => {
  const body = await c.req.json();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password
  });
  return c.json(data);
})

export default app;