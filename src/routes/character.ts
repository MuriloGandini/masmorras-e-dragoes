//Refactored

import { Hono } from "hono";
import {
    createCharacter,
    deleteCharacter,
    updateCharacter,
    readCharacters,
} from "../services/character";
import { supabase } from "../lib/client";
import { readAvSpells } from "../services/available";
import { readSpecific } from "../services/specific";
import { addSpell, removeSpell, readSpells } from "../services/spells";
import { insertItem, deleteItem } from "../services/items";
import { insertLevels, deleteLevels } from "../services/levels";
const app = new Hono();

//Generic

app.get("/", async (c) => {
    const authorization = c.req.header("authorization");
    if (!authorization)
        return c.json({ error: "Autorização não encontrada" }, 401);
    let { data, error } = await supabase.getUser(authorization.slice(7));
    if (error) {
        return c.json({ error: error.message }, 401);
    }
    let id: string = data.user?.id!;
    try {
        return c.json(await readCharacters(id));
    } catch (e: any) {
        console.log(e);
        if (e.message === "Personagem não existe") {
            return c.json({ error: e.message }, 404);
        }
        if (e.message === "O personagem não é seu!") {
            return c.json({ error: e.message }, 403);
        }
        return c.json({ error: "Erro interno ao carregar personagens" }, 500);
    }
});

app.post("/", async (c) => {
    let body = await c.req.json();
    const authorization = c.req.header("authorization");
    if (!authorization)
        return c.json({ error: "Autorização não encontrada" }, 401);
    let { data, error } = await supabase.getUser(authorization.slice(7));
    if (error) {
        return c.json({ error: error.message }, 401);
    }
    let id: string = data.user?.id!;
    try {
        return c.json(await createCharacter(id, body));
    } catch (e: any) {
        if ((e.message = "Você já tem um personagem com esse nome!"))
            return c.json({ error: e.message }, 409);
        return c.json({ error: "Erro interno ao criar personagem" }, 500);
    }
});

app.get("/specific/:character_id", async (c) => {
    const authorization = c.req.header("authorization");
    if (!authorization)
        return c.json({ error: "Autorização não encontrada" }, 401);
    const character_id = Number(c.req.param("character_id"));
    let { data, error } = await supabase.getUser(authorization.slice(7));
    if (error) {
        return c.json({ error: error.message }, 401);
    }
    const user_id = data.user?.id;
    try {
        return c.json(await readSpecific(character_id!, user_id!));
    } catch (e: any) {
        console.log(e);
        if (e.message === "Personagem não existe")
            return c.json({ error: e.message }, 404);
        if (e.message === "O personagem não é seu!")
            return c.json({ error: e.message }, 403);
        return c.json({ error: "Erro interno ao ler personagem" }, 500);
    }
});

//Items
app.post("/:character_id/item", async (c) => {
    const authorization = c.req.header("authorization");
    if (!authorization)
        return c.json({ error: "Token de autorização ausente" }, 401);
    const body = await c.req.json();
    const { data, error } = await supabase.getUser(authorization!.slice(7));
    if (error) {
        return c.json({ error: error.message }, 401);
    }
    const user_id = data.user?.id;
    const item_id: number = body.item_id;
    const character_id: number = Number(c.req.param("character_id"));
    try {
        return c.json(
            await insertItem({
                item_id: item_id,
                character_id: character_id,
                user_id: user_id!,
            }),
        );
    } catch (e: any) {
        return c.json({ error: "Erro interno do servidor" }, 500);
    }
});

app.delete("/:character_id/item/:ch_item_id", async (c) => {
    let ch_item_id = c.req.param("ch_item_id");
    let character_id = c.req.param("character_id");
    const authorization = c.req.header("authorization");
    if (!authorization)
        return c.json({ error: "Token de autorização ausente" }, 401);
    const { data, error } = await supabase.getUser(authorization!.slice(7));
    if (error) {
        return c.json({ error: error.message }, 401);
    }
    const user_id = data.user?.id;
    try {
        return c.json(
            await deleteItem({
                id: Number(ch_item_id),
                user_id: user_id!,
                character_id: Number(character_id),
            }),
        );
    } catch (e: any) {
        if (e.message === "O personagem não é seu!") {
            return c.json({ error: e.message }, 403);
        }
        if (e.message === "Personagem não existe") {
            return c.json({ error: e.message }, 404);
        }
        if (e.message === "O personagem não possui este item") {
            return c.json({ error: e.message }, 404);
        }
        return c.json({ error: "Erro interno do servidor" }, 500);
    }
});

//Levels
app.post("/:character_id/level", async (c) => {
    const body = await c.req.json();
    const authorization = c.req.header("authorization");
    if (!authorization)
        return c.json({ error: "Token de autorização ausente" }, 401);
    let { data, error } = await supabase.getUser(authorization.slice(7));
    if (error) {
        return c.json({ error: error.message }, 401);
    }
    const user_id = data.user?.id;
    const class_id: number = body.class_id;
    const level: number = body.levels;
    const character_id: number = Number(c.req.param("character_id"));
    try {
        return c.json(
            await insertLevels({
                user_id: user_id!,
                class_id: class_id,
                levels: level,
                character_id: character_id,
            }),
        );
    } catch (e: any) {
        if (e.message === "Seu personagem deve ter no máximo 20 níveis.") {
            return c.json({ error: e.message }, 400);
        }
        return c.json({ error: "Erro interno ao adicionar nível" }, 500);
    }
});

app.delete("/:character_id/level/:level_id", async (c) => {
    let character_id = c.req.param("character_id");
    const level_id = c.req.param("level_id");
    const authorization = c.req.header("authorization");
    if (!authorization)
        return c.json({ error: "Token de autorização ausente" }, 401);
    let { data, error } = await supabase.getUser(authorization.slice(7));
    if (error) {
        return c.json({ error: error.message }, 401);
    }
    const user_id = data.user?.id;
    try {
        return c.json(
            await deleteLevels({
                id: Number(level_id),
                character_id: Number(character_id),
                user_id: user_id!,
            }),
        );
    } catch (e: any) {
        if (e.message === "O personagem não é seu!") {
            return c.json({ error: e.message }, 403);
        }
        if (
            e.message === "Personagem não existe" ||
            e.message === "Nível não encontrado"
        ) {
            return c.json({ error: e.message }, 404);
        }
        return c.json({ error: "Erro interno ao deletar nível" }, 500);
    }
});

//Magia
app.post("/:character_id/spell", async (c) => {
    const authorization = c.req.header("authorization");
    if (!authorization)
        return c.json({ error: "Autorização não encontrada" }, 401);
    const body = await c.req.json();
    const character_id = Number(c.req.param("character_id"));
    let { data, error } = await supabase.getUser(authorization.slice(7));
    if (error) {
        return c.json({ error: error.message }, 401);
    }
    let id: string = data.user?.id!;
    try {
        await addSpell({
            user_id: id,
            character_id: character_id,
            spell_id: body.spell_id,
        });
        return c.text("Feitico adicionado");
    } catch (e: any) {
        if (e.message === "O personagem não pode ter essa magia") {
            return c.json({ error: e.message }, 400);
        }
        if (e.message === "Não adicione o mesmo feitiço duas vezes") {
            return c.json({ error: e.message }, 409);
        }
        return c.json({ error: "Erro interno ao adicionar magia" }, 500);
    }
});

app.get("/:character_id/av_spells", async (c) => {
    try {
        let character_id = Number(c.req.param("character_id"));
        const authorization = c.req.header("authorization");
        if (!authorization)
            return c.json({ error: "Autorização não encontrada" }, 401);
        let { data, error } = await supabase.getUser(authorization.slice(7));
        if (error) {
            return c.json({ error: error.message }, 401);
        }
        let user_id: string = data.user?.id!;
        return c.json(await readAvSpells(character_id, user_id));
    } catch (e: any) {
        if (e.message === "Personagem não existe") {
            return c.json({ error: e.message }, 404);
        }
        if (e.message === "O personagem não é seu!") {
            return c.json({ error: e.message }, 403);
        }
        return c.json({ error: "Erro interno do servidor" }, 500);
    }
});

app.delete("/:character_id/spell/:ch_spell_id", async (c) => {
    const authorization = c.req.header("authorization");
    if (!authorization)
        return c.json({ error: "Autorização não encontrada" }, 401);
    const character_id = Number(c.req.param("character_id"));
    const ch_spell_id = Number(c.req.param("ch_spell_id"));
    let { data, error } = await supabase.getUser(authorization.slice(7));
    if (error) {
        return c.json({ error: error.message }, 401);
    }
    let id: string = data.user?.id!;
    try {
        return c.json(
            await removeSpell({
                user_id: id,
                character_id: character_id!,
                ch_spell_id: ch_spell_id!,
            }),
        );
    } catch (e: any) {
        if (e.message === "O personagem não é seu!") {
            return c.json({ error: e.message }, 403);
        }
        if (
            e.message === "Personagem não existe" ||
            e.message === "Magia não encontrada"
        ) {
            return c.json({ error: e.message }, 404);
        }
        return c.json({ error: "Erro interno ao deletar magia" }, 500);
    }
});

//Personagem específico

app.get("/:character_id/spells", async (c) => {
    const authorization = c.req.header("authorization");
    if (!authorization)
        return c.json({ error: "Autorização não encontrada" }, 404);
    const character_id = Number(c.req.param("character_id"));
    let { data, error } = await supabase.getUser(authorization.slice(7));
    if (error) {
        return c.json({ error: error.message }, 401);
    }
    let id: string = data.user?.id!;
    try {
        return c.json(await readSpells(id, character_id));
    } catch (e: any) {
        if (e.message === "Personagem não existe") {
            return c.json({ error: e.message }, 404);
        }
        if (e.message === "O personagem não é seu!") {
            return c.json({ error: e.message }, 403);
        }
        return c.json({ error: "Erro interno ao ler magias" }, 500);
    }
});

app.patch("/:character_id", async (c) => {
    let body = await c.req.json();
    const authorization = c.req.header("authorization");
    if (!authorization)
        return c.json({ error: "Autorização não encontrada" }, 401);
    let { data, error } = await supabase.getUser(authorization.slice(7));
    if (error) {
        return c.json({ error: error.message }, 401);
    }
    let id: string = data.user?.id!;
    const character_id = Number(c.req.param("character_id"));
    try {
        return c.json(await updateCharacter(body, id, character_id));
    } catch (e: any) {
        if (e.message === "Personagem não existe") {
            return c.json({ error: e.message }, 404);
        }
        if (e.message === "O personagem não é seu!") {
            return c.json({ error: e.message }, 403);
        }
        if (e.message === "Você já tem um personagem com este nome") {
            return c.json({ error: e.message }, 409);
        }
        return c.json({ error: "Erro interno ao atualizar personagem" }, 500);
    }
});

app.delete("/:character_id", async (c) => {
    let character_id = Number(c.req.param("character_id"));
    const authorization = c.req.header("authorization");
    if (!authorization)
        return c.json({ error: "Autorização não encontrada" }, 401);
    let { data, error } = await supabase.getUser(authorization.slice(7));
    if (error) {
        return c.json({ error: error.message }, 401);
    }
    let user_id: string = data.user?.id!;
    try {
        return c.json(await deleteCharacter(character_id, user_id));
    } catch (e: any) {
      console.log(e)
        if (e.message === "Personagem não existe") {
            return c.json({ error: e.message }, 404);
        }
        if (e.message === "O personagem não é seu!") {
            return c.json({ error: e.message }, 403);
        }
        return c.json({ error: "Erro interno ao deletar personagem" }, 500);
    }
});

export default app;
