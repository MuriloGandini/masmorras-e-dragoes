import { Hono } from "hono";
import { spellsInfo } from "../services/info";
const app = new Hono();

app.post('/spells', async (c) => {
  const body = await c.req.json();
  
  if (!body.spell_ids) {
    return c.json({message: "Insira o id de feiticos"}, 400);
  }
  if (body.spell_ids.length==0 || typeof(body.spell_ids)!="object") {
    return c.text("O array é invalido")
  }
  try { return c.json(await spellsInfo(body.spell_ids)) }
  catch (e:any) {
    return c.json({message: e.message}, 500)
  }
})

export default app