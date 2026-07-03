//refactored

import { prisma } from "../lib/client";
import { Prisma } from "../generated/prisma/client";
interface Character {
    id: number;
    user_id: number;
    strength: number;
    charisma: number;
    intelligence: number;
    wisdom: number;
    constitution: number;
    dexterity: number;
    name: string;
}

interface Body {
    ab_str?: number;
    ab_cha?: number;
    ab_wis?: number;
    ab_dex?: number;
    ab_con?: number;
    ab_int?: number;
    name?: string;
}

export async function updateCharacter(
    body: Body,
    user_id: string,
    character_id: number,
) {
    let userId = await prisma.characters.findFirst({
        where: { id: character_id },
        select: { user_id: true },
    });
    if (userId?.user_id === user_id) {
        try {
            await prisma.characters.update({
                where: { id: character_id },
                data: {
                    ...(body.ab_str && { ab_str: body.ab_str }),
                    ...(body.ab_cha && { ab_cha: body.ab_cha }),
                    ...(body.ab_dex && { ab_dex: body.ab_dex }),
                    ...(body.ab_con && { ab_con: body.ab_con }),
                    ...(body.ab_int && { ab_int: body.ab_int }),
                    ...(body.ab_wis && { ab_wis: body.ab_wis }),
                    ...(body.name && { name: body.name }),
                },
            });
            return "Personagem atualizado!";
        } catch (e: any) {
            if (
                e instanceof Prisma.PrismaClientKnownRequestError &&
                e.code === "P2002"
            ) {
                throw new Error("Você já tem um personagem com este nome");
            }
        }
    } else {
        if (!userId) {
            throw new Error("Personagem não existe");
        } else {
            throw new Error("O personagem não é seu!");
        }
    }
}

export async function deleteCharacter(id: number, user_id: string) {
    let userId = await prisma.characters.findFirst({
        where: { id: id },
        select: { user_id: true },
    });
    if (userId?.user_id == user_id) {
        await prisma.characters.delete({
            where: { id: id },
        });
        return "Personagem deletado!";
    } else {
        if (!userId) {
            throw new Error("Personagem não existe");
        } else {
            throw new Error("O personagem não é seu!");
        }
    }
}

export async function readCharacters(user_id: string) {
    let character = await prisma.characters.findMany({
        where: { user_id: user_id },
        include: {
            items: { select: { item_id: true } },
            levels: { select: { class_id: true } },
            spells: { select: { spell_id: true } },
        },
    });
    return character.map((t) => ({
        ...t,
        id: Number(t.id),
        items: t.items.map((i) => ({ item_id: Number(i.item_id) })),
        levels: t.levels.map((l) => ({ class_id: Number(l.class_id) })),
        spells: t.spells.map((s) => ({ spell_id: Number(s.spell_id) })),
    }));
}

export async function createCharacter(id: string, character: Character) {
    try {
        await prisma.characters.create({
            data: {
                user_id: id,
                ab_str: character.strength,
                ab_cha: character.charisma,
                ab_wis: character.wisdom,
                ab_dex: character.dexterity,
                ab_con: character.constitution,
                ab_int: character.intelligence,
                name: character.name,
            },
        });
    } catch (e: any) {
        if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === "P2002"
        ) {
            throw new Error("Você já tem um personagem com esse nome!");
        }
        throw e;
    }
    return "Personagem criado!";
}
