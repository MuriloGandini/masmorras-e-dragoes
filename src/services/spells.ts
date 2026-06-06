import { prisma } from "../lib/client.ts";
import { Prisma } from "../generated/prisma/client.ts";
export async function readSpells(user_id: string, character_id: number) {
    const id = await prisma.characters.findFirst({
        where: { id: character_id },
        select: { user_id: true },
    });
    if (id?.user_id == user_id) {
        const spells = await prisma.spells.findMany({
            where: { character_id: character_id },
            select: { spell_id: true },
        });
        const spell_ids: number[] = spells.map((s) => s.spell_id);
        const spellArray = await prisma.available_spells.findMany({
          where: { id: { in: spell_ids } },
          omit: {id: true}
        });
        return spellArray;
    }
}
export async function addSpell(addSpell: { user_id: string, character_id: number, spell_id: number }) {
  const id = await prisma.characters.findFirst({
      where: { id: addSpell.character_id },
      select: { user_id: true },
  });
  if (id?.user_id === addSpell.user_id) {
    const classes = await prisma.class_spells.findMany({
      where: { spell_id: addSpell.spell_id },
      select: {class_id: true}
    })
    const availableTo: number[] = classes.map((t)=>Number(t.class_id))
    const characterClasses = await prisma.levels.findMany({
      where: { character_id: addSpell.character_id },
      select: { class_id: true }
    });
    let isAvailable: boolean = characterClasses.some(c => availableTo.includes(Number(c.class_id)));
    if (isAvailable) {
      try {
        await prisma.spells.create({
          data: {
            character_id: addSpell.character_id,
            spell_id: addSpell.spell_id
          }
        })
        return "Magia adicionada";
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          return "Não adicione duas vezes o mesmo feitico!"
        }
        throw e
      }
    } else {
      return "Seu personagem não pode ter essa magia!";
    }
  } else {
    return "O personagem não é seu!";
  }
}

export async function removeSpell(removeSpell: { user_id: string, character_id: number, spell_id: number }) {
  const id = await prisma.characters.findFirst({
      where: { id: removeSpell.character_id },
      select: { user_id: true },
  });
  if (id?.user_id == removeSpell.user_id) {
    await prisma.spells.delete({
      where: { id: removeSpell.spell_id }
    });
    return "Feitiço deletado";
  } else {
    return "O personagem não é seu!"
  }
}