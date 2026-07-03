import { prisma } from "../lib/client";

export async function spellsInfo(array: number[]) {
  if (array.length === 0) {
    return "Array vazio!";
  }; 
  const res = await prisma.available_spells.findMany({
    where:{id: {in: array}}
  })
  console.log(res)
  return res
}