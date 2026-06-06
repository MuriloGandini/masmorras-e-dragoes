import { prisma } from "../lib/client";
export async function readSpecific(character_id: number, user_id: string) {
  const id = await prisma.characters.findFirst({
    where: { id: character_id },
    select: { user_id: true },
  });
  if (user_id == id?.user_id) {
    const character = await prisma.characters.findFirst({
      where: { id: character_id },
      omit: { id: true },
    });
    const items = await prisma.items.findMany({
      where: { character_id: character_id },
      omit: { id: true, character_id: true },
    });
    const levels = await prisma.levels.findMany({
      where: { character_id: character_id },
      omit: { character_id: true, id: true },
    });

    return {
      character,
      items: items.map((i) => ({
        item_id: Number(i.item_id),
        created_at: i.created_at
      })),
      levels: levels.map((t) => ({
        level: t.level,
        created_at: t.created_at,
        id: Number(t.class_id),
      })),
    };
  }
}
