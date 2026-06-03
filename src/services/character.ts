import { prisma } from "../lib/prisma";
interface Character{
  strength: number;
  charisma: number;
  intelligence: number;
  wisdom: number;
  constitution: number;
  dexterity: number;
  name: string;
}


export async function createCharacter(id: string, character: Character, authorization: string) {
  return await prisma.characters.create({
    data: {
      user_id: id,
      ab_str: character.strength,
      ab_cha: character.charisma,
      ab_wis: character.wisdom,
      ab_dex: character.dexterity,
      ab_con: character.constitution,
      ab_int: character.intelligence,
      name: character.name
    }
  })
}