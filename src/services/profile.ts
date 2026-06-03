import { prisma, supabase } from "../lib/client";
export async function lerUsuario(id: string) {
  return await prisma.usuarios.findFirst({
    where: { id: id },
  })
}
