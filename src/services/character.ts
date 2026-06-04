import { prisma } from "../lib/client";

interface Character {
  id:number;
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
  character_id: number;
  ab_str?: number;
  ab_cha?: number;
  ab_wis?: number;
  ab_dex?: number;
  ab_con?: number;
  ab_int?: number;
  name?: string;
}

export async function updateCharacter(body: Body, user_id: string) {
  let characterId = await prisma.characters.findFirst({
    where: { id: body.character_id },
    select: { user_id: true },
  });
  if (characterId?.user_id === user_id) {
    await prisma.characters.update({
      where: { id: body.character_id },
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
  } else {
    return "O personagem não é do usuário"
  }
}

export async function deleteCharacter(id: number, user_id: string) {
  let characterId = await prisma.characters.findFirst({
    where: { id: id },
    select: { user_id: true },
  });
  if (characterId?.user_id == user_id) {
    return await prisma.characters.delete({
      where: { id: id },
    });
  } else {
    return "Este personagem não é seu!";
  }
}

export async function readCharacter( user_id: string) {
  let character = await prisma.characters.findMany({
    where: { user_id: user_id },
    include: {
      items: { select: { item_id: true } },
      levels: { select: { class_id: true } },
    },
  });
  return character.map(t=>({...t, id: Number(t.id)}));
}

export async function createCharacter(id: string, character: Character) {
  return await prisma.characters.create({
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
}
