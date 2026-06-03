import { Hono } from 'hono'
import perfil from './src/routes/profile.ts';
import roll from './src/routes/roll.ts';
import character from './src/routes/character.ts';
import signin from './src/routes/signin.ts';
import levels from './src/routes/levels.ts';
import items from './src/routes/items.ts';
const app = new Hono()
app.get('/', (c) => {
  return c.text("Hello World!")
})
app.route('/roll', roll);
app.route('/profile', perfil); 
app.route('/character', character);
app.route('/token', signin);
app.route('/levels', levels);
app.route('/items', items);
export default app