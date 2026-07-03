import { prisma } from "../lib/client";
interface Item {
  user_id: string;
  item_id: number;
  character_id: number;
}
interface DeleteItem {
  user_id: string;
  id: number;
  character_id: number;
}
export async function deleteItem(item: DeleteItem) {
  const user_id = await prisma.characters.findFirst({
    where: { id: item.character_id },
    select: { user_id: true },
  });
  if (item.user_id === user_id?.user_id) {
    try {
      await prisma.items.delete({
        where: { id: item.id }
      });
      return "Item removido"
    } catch (e: any) {
      throw new Error("O personagem não possui este item")
    }
  } else {
    if (!user_id?.user_id) {
      throw new Error("Personagem não existe");
    } else {
      throw new Error("O personagem não é seu!")
    }
  }
}

export async function insertItem(item: Item) {
  const user_id = await prisma.characters.findFirst({
    where: { id: item.character_id },
    select: { user_id: true },
  });
  if (!item.user_id) {
    throw new Error("Personagem não existe")
  }
  if (item.user_id !== user_id?.user_id) {
    throw new Error("O personagem não é seu!");
  } else {
    await prisma.items.create({
      data: {
        character_id: item.character_id,
        item_id: item.item_id
      }
    })
    return "item adicionado!";
  }
}
