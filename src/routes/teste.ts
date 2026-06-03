import { Hono } from "hono";
import { prisma } from "../lib/prisma";
const app = new Hono();

app.get("/", async (c) => {
  const result = await prisma.characters.findFirst({
    where: { id: 5 },
    select: { name: true , id: true},
  });
  return c.json(result);
});

export default app;
