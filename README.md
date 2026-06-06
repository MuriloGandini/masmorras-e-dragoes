# masmorras-e-dragoes
This website is made as an alternative for the famous app called D&D beyond. This is made specially for the brazilian natives that cannot speak english fluently still understand D&D and be able to play with the technologies of today.

# Request link
https://masmorras-e-dragoes.onrender.com

# Headers
- Authorization: `Bearer ${JWT}`, which contains the user ID

# Endpoints
## /character
### post
- In the body, the necessary attributes in JSON are: `ab_cha, ab_int, ab_wis, ab_str, ab_dex, ab_con, name`. 
- The info of your character will be saved into the database.
- In the queries, your JWT authentication token will be saved to make only you be able to edit and delete your own characters.
- Example: `{ "ab_cha": 18, "ab_int": 10, "ab_wis": 6, "ab_str": 20, "ab_dex": 5, "ab_con": 16, "name": "john doe" }` creates the character john doe.
### get
- On the queries, your character's id will be submitted, and the server will return your character, and all his info.
- Query params: `character_id`
- Example: `masmorras-e-dragoes.onrender.com/character?character_id=6` returns the data of character with id 6
### patch
- The data you want to change will be submitted into the body, and then it will submit every change you send.
- The body parts are `ab_cha?, ab_int?, ab_wis?, ab_str?, ab_dex?, ab_con?, name?, character_id` where ? represents that it is optional.
- Example: `{ "character_id":6, "ab_cha": 18 }` switches the charisma of the character to 18
### delete
- The character id is submitted along to the user id.
- The user ID will be verified to be the owner of the character ID, and then, it will delete if you are the owner of the character.
- Query params: `character_id`
- Example: `masmorras-e-dragoes.onrender.com/character?character_id=6`, deletes the character of id 6

## /profile(WIP)
### get
- See your profile by just calling the route with get
- Will have entire CRUD after development.
- Example: `masmorras-e-dragoes.onrender.com/profile`, returning for example `{ "nome_usuario": "johndoe123", "foto_perfil": "prettypic.jpg" }`
## /roll
### get
- In the query params, put two `roll` attributes: the first one for the ammount of dice, and the second one for the highest number on the dice
- Example: `masmorras-e-dragoes.onrender.com/roll?roll=1&roll=8`
## /items
### post
- The body is required to have: `character_id, item_id`, and it inserts an item into the character.
- Example: `{ "character_id": 6, "item_id": 1 }`, adds item of id 1 into character of id 6
### delete
- The query params are: `character_id, ch_item_id`
- It gets the character id given, and validates the user id, then, if its valid, it'll delete the item in the id given.
- Example: `masmorras-e-dragoes.onrender.com/items?character_id=6&ch_item_id=7` deletes the owned item with id 7, verifying if its from character with id 6 and if you own this character.

## /levels
### post
- The body is required to have: `character_id, class_id, levels`, and it inserts a class into the character, with the amount of levels given.
- Example: `{ "character_id": 6, "class_id": 1, "levels": 15 }` adds 15 levels to character of id 6, in the class with id 1

### delete
- The query params are: `character_id, id`
- It gets the character id given, and validates the user id, then, if its valid, it'll delete the levels in the id given.
- Example: `masmorras-e-dragoes.onrender.com/levels?character_id=6&id=1` deletes the levels of id 1, verifying if its from the character 6 and if you own character 6
## /token
### post
- The body parts are: `email, password`.
- It signs in with Supabase Auth, and returns the entire user. It's used provisorily to get the acess token and thus test the auth parts of the API.
- Example: `{ "email": "johndoe@dnd.com", "password": "johndoe123" }`
## /spells
### post
- Use this to add a spell into your character
- body parts: `character_id, spell_id`, each sharing the id of the character and the id of the spell you want to add
- Example: `"{ character_id": 6, "spell_id": 1 }` adds the spell of id 1 to the character of id 6
### get
- Use this to gather all the spells of a character you own.
- query params: `character_id`, which is the id of the character you want to see the spells. Notice you need to own the character to see its spells.
- Example: `masmorras-e-dragoes.onrender.com/spells?character_id=6` retrieves the spells of the character of id 6
### delete
- Use this to delete a spell from a character you own.
- query params: `character_id, ch_spell_id`. Notice the `ch_spell_id` is the owning of the spell, not the global spell description.
- Example: `masmorras-e-dragoes.onrender.com/spells?character_id=6&ch_spell_id=4` deletes the owning spell of id 4.