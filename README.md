# masmorras-e-dragoes
This website is made as an alternative for the famous app called D&D beyond. This is made specially for the brazilian natives that cannot speak english fluently still understand D&D and be able to play with the technologies of today.

# Headers
- Authorization: `Bearer ${JWT}`, which contains the user ID

# Endpoints
## /character
### post
- In the body, the necessary attributes in JSON are: `ab_cha, ab_int, ab_wis, ab_str, ab_dex, ab_con, name`. 
- The info of your character will be saved into the database.
- In the queries, your JWT authentication token will be saved to make only you be able to edit and delete your own characters.
### get
- On the queries, your character's id will be submitted, and the server will return your character, and all his info.
### patch
- The data you want to change will be submitted into the body, and then it will submit every change you send.
- The body parts are `ab_cha?, ab_int?, ab_wis?, ab_str?, ab_dex?, ab_con?, name?, character_id`.
### delete
- The character id is submitted along to the user id.
- The user ID will be verified to be the owner of the character ID, and then, it will delete if you are the owner of the character.

## /profile(WIP)
### get
- See your profile by just calling the route with get
- Will have entire CRUD after development.
## /roll
### get
- In the query params, put two 'roll' attributes: the first one for the ammount of dice, and the second one for the highest number on the dice(EX: ?dice=1&dice=8 rolls 1d8 and ?dice=2&dice=10 rolls 2d10)
## /items
### post
- The body is required to have: `character_id, item_id`, and it inserts an item into the character.
### delete
- The query params are: `character_id, id`
- It gets the character id given, and validates the user id, then, if its valid, it'll delete the item in the id given.

## /levels
### post
- The body is required to have: `character_id, id, levels`, and it inserts a class into the character, with the amount of levels given.

### delete
- The query params are: `character_id, id`
- It gets the character id given, and validates the user id, then, if its valid, it'll delete the levels in the id given.
## /token
### post
- The body parts are: `email, password`.
- It signs in with Supabase Auth, and returns the entire user. It's used provisorily to get the acess token and thus test the auth parts of the API.