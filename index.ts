import { Hono } from "hono";
import { cors } from "hono/cors";
import perfil from "./src/routes/profile.ts";
import roll from "./src/routes/roll.ts";
import character from "./src/routes/character.ts";
import signin from "./src/routes/signin.ts";
import classes from './src/routes/classes.ts';
import item_list from './src/routes/item_list.ts'
import { rateLimiter } from "hono-rate-limiter";
import info from './src/routes/info.ts'
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
    return c.text("Server is up!");
});
app.route("/roll", roll);
app.route("/profile", perfil);
app.route("/character", character);
app.route("/token", signin);
app.route('/classes', classes);
app.route('/item-list', item_list);
app.route('/info', info)
export default app;
