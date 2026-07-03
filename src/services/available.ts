import { prisma } from "../lib/client";

export async function readClasses() {
    const classes = await prisma.available_class.findMany({
        select: { name: true, id: true },
    });
  return classes.map((s) => ({
    name: s.name,
    id: Number(s.id)
  }))
}
export async function readItems() {
    const items = await prisma.available_items.findMany({
        select: { name: true, id: true },
    });
  return items.map(s => ({
    name: s.name,
    id: Number(s.id)
  }))
}
export async function readAvSpells(character_id: number, user_id: string) {
    const Uid = await prisma.characters.findFirst({
        where: { id: character_id },
        select: { user_id: true },
    });
    if (Uid?.user_id === user_id) {
        let classes = await prisma.levels.findMany({
            where: { character_id: character_id },
            select: { class_id: true },
        });
        const class_ids = classes.map((t) => t.class_id);
        let spells: { class_id: bigint; spell_id: number }[] | number[] =
            await prisma.class_spells.findMany({
                where: { class_id: { in: class_ids } },
            });
        spells = spells.map((t) => t.spell_id);
        return await prisma.available_spells.findMany({
            where: { id: { in: spells } },
            select: { name: true, id: true },
        });
    } else {
      if (!Uid) {
        throw new Error( "Personagem não existe")
      } else {
        throw new Error("O personagem não é seu!");
      }
    }
}
