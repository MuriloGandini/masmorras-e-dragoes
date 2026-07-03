import { Hono } from "hono";
import { readClasses } from "../services/available";
const app = new Hono();

app.get('/', async (c) => {
  try {
    return c.json(await readClasses());
  } catch (e: any) {
    return c.json({ message: e.message }, 500)
  }
});

export default app;
