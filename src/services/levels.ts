import { prisma } from "../lib/prisma";
interface CharacterLevel {
  user_id: string;
  class_id: number;
  levels: number;
  character_id: number;
}

export async function insertLevels(
  level: CharacterLevel,
  authorization: string,
) {
  const user_id = await prisma.characters.findFirst({
    where: { id: level.character_id },
    select: {user_id: true}
  })
  
  if (level.user_id !== user_id?.user_id){
    return "coisa feia, nao vai botar nivel no personagem dos outros";
  } else {
    return prisma.levels.create({
      data: {
        character_id: level.character_id,
        class_id: level.class_id,
        level: level.levels
      }
    })
  }
  
}
