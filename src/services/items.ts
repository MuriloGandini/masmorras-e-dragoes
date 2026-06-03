import { createClient } from "@supabase/supabase-js";

interface Item{
  user_id: string;
  item_id: number;
  character_id: number;
}

export async function insertItem(item: Item, authorization: string) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {global: {headers: {Authorization: authorization}}}
  )
  const { data, error } = await supabase.from('characters').select('user_id').eq('id', item.character_id);
  if (item.user_id !== data?.[0]?.user_id) {
    return "nao mexe nos personagem que nao sao teu";
  } else {
    return await supabase.from('items').insert({ character_id: item.character_id, item_id: item.item_id });
  }
}