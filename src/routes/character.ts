import { Hono } from "hono";
import {
    createCharacter,
    deleteCharacter,
    updateCharacter,
    readCharacter,
} from "../services/character";
import { supabase } from "../lib/client";
const app = new Hono();

app.patch("/", async (c) => {
    let body = await c.req.json();
    const authorization = c.req.header("Authorization")!;
    let { data, error } = await supabase.getUser(authorization.slice(7));
    let id: string = data.user?.id!;
    try {
        return c.json(await updateCharacter(body, id));
    } catch (e) {
        return c.json(e);
    }
});
app.delete("/", async (c) => {
    let character_id = Number(c.req.query("id"));
    const authorization = c.req.header("Authorization")!;
    let { data, error } = await supabase.getUser(authorization.slice(7));
    let id: string = data.user?.id!;
    try {
        return c.json(await deleteCharacter(character_id, id));
    } catch (e) {
        return c.json(e);
    }
});

app.get("/", async (c) => {
    let character_id = Number(c.req.query("id"));
    const authorization = c.req.header("Authorization")!;
    let { data, error } = await supabase.getUser(authorization.slice(7));
    let id: string = data.user?.id!;
    try {
        return c.json(await readCharacter(id));
    } catch (e) {
        return c.json(e);
    }
});

app.post("/", async (c) => {
    let body = await c.req.json();
    const authorization = c.req.header("Authorization")!;
    let { data, error } = await supabase.getUser(authorization.slice(7));
    let id: string = data.user?.id!;
    try {
        return c.json(await createCharacter(id, body));
    } catch (e) {
        return c.json(e);
    }
});

export default app;
