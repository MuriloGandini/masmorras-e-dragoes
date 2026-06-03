import { createClient } from "@supabase/supabase-js";

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

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { global: { headers: { Authorization: authorization } } }
  )
  
  return await supabase.from('characters').insert({
    user_id: id,
    ab_str: character.strength,
    ab_cha: character.charisma,
    ab_wis: character.wisdom,
    ab_dex: character.dexterity,
    ab_con: character.constitution,
    ab_int: character.intelligence,
    name: character.name
  })
}