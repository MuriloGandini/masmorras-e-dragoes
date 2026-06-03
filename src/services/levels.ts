import { createClient } from "@supabase/supabase-js";

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
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { global: { headers: { Authorization: authorization } } },
  );

  const { data, error } = await supabase.from('characters').select('user_id').eq('id', level.character_id);
  
  if (level.user_id !== data?.[0]?.user_id){
    return "coisa feia, nao vai botar nivel no personagem dos outros";
  } else {
    return supabase.from('levels').insert({character_id: level.character_id, class_id: level.class_id, level: level.levels, })
  }
  
}
