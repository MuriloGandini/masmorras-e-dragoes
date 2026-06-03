import { prisma } from "../lib/client";
interface CharacterLevel {
  user_id: string;
  class_id: number;
  levels: number;
  character_id: number;
}

interface deleteLevel{
  id: number;
  character_id: number;
  user_id: string;
}

export async function deleteLevels(level:deleteLevel) {
  const user_id = await prisma.characters.findFirst({
    where: { id: level.character_id },
    select: { user_id: true },
  });
  if (level.user_id === user_id?.user_id) {
    return await prisma.levels.delete({
      where: { id: level.id }
    });
  } else {
    return "O personagem não é seu"
  }
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
    await prisma.levels.create({
      data: {
        character_id: level.character_id,
        class_id: level.class_id,
        level: level.levels
      }
    });
    return `Nível criado no personagem de id ${level.character_id}`
  }
}

