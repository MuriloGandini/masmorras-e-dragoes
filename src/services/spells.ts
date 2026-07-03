import { prisma } from "../lib/client.ts";
import { Prisma } from "../generated/prisma/client.ts";
export async function readSpells(user_id: string, character_id: number) {
    const id = await prisma.characters.findFirst({
        where: { id: character_id },
        select: { user_id: true },
    });
    if (!id?.user_id) {
        throw new Error("Personagem não existe");
    }
    if (id.user_id !== user_id) {
        throw new Error("O personagem não é seu!");
    }
    const spells = await prisma.spells.findMany({
        where: { character_id: character_id },
        select: { spell_id: true, id: true },
    });
  const own_spell_ids: number[] = spells.map((s)=> s.id)
  const spell_ids: number[] = spells.map((s) => s.spell_id);
  const spellArrayObjects = await prisma.available_spells.findMany({
        where: { id: { in: spell_ids } },
        omit: { id: true },
  });
  const spellArray = []
  for (const i in spellArrayObjects) {
    spellArray.push({
      ...spellArrayObjects[i],
      own_id: own_spell_ids[i]
    })
  }
  return spellArray;
}

export async function addSpell(addSpell: {
    user_id: string;
    character_id: number;
    spell_id: number;
}) {
    const id = await prisma.characters.findFirst({
        where: { id: addSpell.character_id },
        select: { user_id: true },
    });
    if (!id?.user_id) {
        throw new Error("Personagem não existe");
    }
    if (id.user_id !== addSpell.user_id) {
        throw new Error("O personagem não é seu!");
    }
    const classes = await prisma.class_spells.findMany({
        where: { spell_id: addSpell.spell_id },
        select: { class_id: true },
    });
    const availableTo: number[] = classes.map((t) => Number(t.class_id));
    const characterClasses = await prisma.levels.findMany({
        where: { character_id: addSpell.character_id },
        select: { class_id: true },
    });
    let isAvailable: boolean = characterClasses.some((c) =>
        availableTo.includes(Number(c.class_id)),
    );

    if (!isAvailable) {
        throw new Error("O personagem não pode ter essa magia");
    }

    try {
        const novaMagia = await prisma.spells.create({
            data: {
                character_id: addSpell.character_id,
                spell_id: addSpell.spell_id,
            },
        });
        return {
            success: true,
            message: "Magia adicionada com sucesso!",
            data: novaMagia,
        };
    } catch (e) {
        if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === "P2002"
        ) {
            throw new Error("Não adicione o mesmo feitiço duas vezes");
        }
        throw e;
    }
}

export async function removeSpell(removeSpell: {
    user_id: string;
    character_id: number;
    ch_spell_id: number;
}) {
    const id = await prisma.characters.findFirst({
        where: { id: removeSpell.character_id },
        select: { user_id: true },
    });
    if (!id?.user_id) {
        throw new Error("Personagem não existe");
    }
    if (id.user_id !== removeSpell.user_id) {
        throw new Error("O personagem não é seu!");
    }
    const deletedSpell = await prisma.spells.delete({
        where: { id: removeSpell.ch_spell_id },
    });
    return { success: true, message: "Magia removida"};
}
