import { Hono } from "hono";
import { cors } from "hono/cors";
import perfil from "./src/routes/profile.ts";
import roll from "./src/routes/roll.ts";
import character from "./src/routes/character.ts";
import signin from "./src/routes/signin.ts";
import levels from "./src/routes/levels.ts";
import items from "./src/routes/items.ts";
import specific from "./src/routes/specific.ts";
import spells from "./src/routes/spells.ts";
import { rateLimiter } from "hono-rate-limiter";
const app = new Hono();

const limiter = rateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 35,
  keyGenerator: (c)=> c.req.header('x-forwarded-for') ?? ''
})
app.use(
  '*',
    cors({
        origin: "*",
        allowHeaders: [
            "X-Custom-Header",
            "Upgrade-Insecure-Requests",
            "Authorization",
        ],
        allowMethods: ["POST", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
        maxAge: 600,
        credentials: true,
    }),
    limiter
);
app.get("/", (c) => {
    return c.text("Hello World!");
});
app.route("/spells", spells);
app.route("/specific", specific);
app.route("/roll", roll);
app.route("/profile", perfil);
app.route("/character", character);
app.route("/token", signin);
app.route("/levels", levels);
app.route("/items", items);
export default app;
