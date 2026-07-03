import { prisma } from "../lib/client";
interface CharacterLevel {
    user_id: string;
    class_id: number;
    levels: number;
    character_id: number;
}

interface deleteLevel {
    id: number;
    character_id: number;
    user_id: string;
}

export async function deleteLevels(level: deleteLevel) {
    const user_id = await prisma.characters.findFirst({
        where: { id: level.character_id },
        select: { user_id: true },
    });
    if (!user_id?.user_id) {
        throw new Error("Personagem não existe");
    }
    if (level.user_id !== user_id.user_id) {
        throw new Error("O personagem não é seu!");
    }
    try {
        await prisma.levels.delete({
            where: { id: level.id },
        });
        return "Nível removido";
    } catch (e: any) {
        throw new Error("Nível não encontrado");
    }
}

export async function insertLevels(level: CharacterLevel) {
    const user_id = await prisma.characters.findFirst({
        where: { id: level.character_id },
        select: { user_id: true },
    });
    const ch_levels = await prisma.levels.findMany({
        where: { character_id: level.character_id },
        select: { level: true },
    });
    const sum = ch_levels.map((t) => t.level).reduce((acc, val) => acc + val);
    if (!user_id?.user_id) {
        throw new Error("Personagem não existe");
    }
    if (level.user_id !== user_id?.user_id) {
        throw new Error("O personagem não é seu!");
    }
    if (20 - sum >= level.levels) {
        try {
            await prisma.levels.create({
                data: {
                    character_id: level.character_id,
                    class_id: level.class_id,
                    level: level.levels,
                },
            });
            return `Nível criado no personagem de id ${level.character_id}`;
        } catch (e: any) {
            throw new Error("Erro interno ao adicionar nível");
        }
    } else {
        throw new Error("Seu personagem deve ter no máximo 20 níveis.");
    }
}
