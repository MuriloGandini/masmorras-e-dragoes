import { Hono } from 'hono'
import perfil from './src/routes/perfil.ts';
import roll from './src/routes/roll.ts';
import character from './src/routes/character.ts';
import signin from './src/routes/signin.ts';
import levels from './src/routes/levels.ts';
import items from './src/routes/items.ts';
import teste from './src/routes/teste.ts'
const app = new Hono()
app.route('/roll', roll);
app.route('/perfil', perfil);
app.route('/character', character);
app.route('/token', signin);
app.route('/levels', levels);
app.route('/items', items);
app.route('/test', teste)
export default app