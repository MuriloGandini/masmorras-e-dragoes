import { Hono } from "hono";
import { readItems } from "../services/available";
const app = new Hono();

app.get('/', async (c) => {
  return c.json(await readItems());
})
export default app