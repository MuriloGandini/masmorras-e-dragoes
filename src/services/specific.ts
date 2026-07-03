import { prisma } from "../lib/client";
export async function readSpecific(character_id: number, user_id: string) {
    const character = await prisma.characters.findFirst({
        where: { id: character_id },
    });
    if (!character?.user_id) {
        throw new Error("Personagem não existe");
    }
    if (user_id !== character.user_id) {
        throw new Error("O personagem não é seu!");
    }
    const items = await prisma.items.findMany({
        where: { character_id: character_id },
        select: { id: true, item_id: true },
    });
    const levels = await prisma.levels.findMany({
        where: { character_id: character_id },
        select: { id: true, class_id: true, level: true },
    });
    const spells = await prisma.spells.findMany({
        where: { character_id: character_id },
        select: { id: true, spell_id: true },
    });

    //LEMBRETE PRA COLOCAR OUTPUTS NO README

    return {
        character: {
            id: Number(character.id),
            ab_cha: character.ab_cha,
            ab_wis: character.ab_wis,
            ab_int: character.ab_int,
            ab_str: character.ab_str,
            ab_dex: character.ab_dex,
            ab_con: character.ab_con,
            name: character.name,
        },
        items: items.map((i) => ({
            item_id: Number(i.item_id),
            id: Number(i.id),
        })),
        levels: levels.map((t) => ({
            level: t.level,
            class_id: Number(t.class_id),
            id: Number(t.id),
        })),
        spells: spells.map((t) => ({
            id: Number(t.id),
            spell_id: Number(t.spell_id),
        })),
    };
}
