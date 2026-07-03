import { Hono } from 'hono'
const app = new Hono()
import { rollDice } from '../services/roll'

app.get('/', async (c) => {
  const amount = Number(c.req.query('amount'));
  const type = Number(c.req.query('type'));
  return c.json(await rollDice(amount, type))
})

export default app