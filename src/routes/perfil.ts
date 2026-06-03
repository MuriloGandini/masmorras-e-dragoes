import { supabase } from '../lib/prisma'
import { Hono } from 'hono'
import { lerUsuario } from '../services/perfil';
const app = new Hono()

app.get('/', async (c) => {
  const authorization = c.req.header('Authorization')!;
  let {data, error} = await supabase.getUser(authorization.slice(7));
  return c.json(await lerUsuario(data.user?.id!));
})

export default app