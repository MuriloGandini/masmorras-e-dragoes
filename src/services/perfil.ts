import { PrismaClient } from "../generated/prisma/client";
const prisma = new PrismaClient();
export async function lerUsuario(id: string) {
  return await supabase.from('usuarios').select('*').eq('id', id);
}
