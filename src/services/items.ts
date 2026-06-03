import { prisma } from "../lib/prisma";
interface Item {
  user_id: string;
  item_id: number;
  character_id: number;
}

export async function insertItem(item: Item) {
  const user_id = await prisma.characters.findFirst({
    where: { id: item.character_id },
    select: { user_id: true },
  });
  if (item.user_id !== user_id?.user_id) {
    return "nao mexe nos personagem que nao sao teu";
  } else {
    return await prisma.items.create({
      data: {
        character_id: item.character_id,
        item_id: item.item_id
      }
    })
  }
}
