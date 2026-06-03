import { Hono } from 'hono'
const app = new Hono()
import { rollDice } from '../services/roll'

app.get('/', async (c) => {
  return c.json(await rollDice(c.req.queries().dado!));
})

export default app