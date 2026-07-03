# masmorras-e-dragoes
This API is made as an alternative for the famous app called D&D beyond. This is made specially for the brazilian natives that cannot speak english fluently still understand D&D and be able to play with the technologies of today.

# Setup
To set up this API locally follow these steps:
## Clone the repository and enter the project:
git clone git@github.com:MuriloGandini/masmorras-e-dragoes.git
cd masmorras-e-dragoes
## Install dependencies
`bun install`, `pnpm install`, `npm install`, etc.
## Follow de .env.example file and enter your desired info for your database
Your .env should look like this:
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_URL=
RANDOM_KEY=
DATABASE_URL=
DIRECT_URL=
## Run prisma migrations
`bunx --bun prisma db push`, `npx prisma db push`, etc.
## Run the server
`bun dev`, `pnpm dev`, `npm dev`, etc.

# Request link
https://masmorras-e-dragoes.onrender.com

# Headers
- Authorization: `Bearer ${JWT}`, which contains the user ID

# Endpoints
## /character
### `GET /`
* Gets the user characters based off the `Authorization` header.
* Example: 
	* Input: `GET /character`
	* Output:
	```json
	[
		{
			"id": 6,
			"created_at": "2026-06-03T17:31:41.900Z",
			"user_id": "3a2f6fce-ed18-4a9d-ab7e-84d52f01a050",
			"ab_str": 10,
			"ab_dex": 12,
			"ab_cha": 18,
			"ab_wis": 16,
			"ab_int": 18,
			"ab_con": 11,
			"name": "Franco Zan",
			"items": [
				{
					"item_id": 1
				}
			],
			"levels": [
				{
					"class_id": 1
				}
			],
			"spells": [
				{
					"spell_id": 1
				}
			]
		},
		{
			"id": 7,
			"created_at": "2026-06-07T16:55:18.264Z",
			"user_id": "3a2f6fce-ed18-4a9d-ab7e-84d52f01a050",
			"ab_str": 8,
			"ab_dex": 15,
			"ab_cha": 18,
			"ab_wis": 10,
			"ab_int": 14,
			"ab_con": 11,
			"name": "john doe",
			"items": [],
			"levels": [],
			"spells": []
		},
		{
			"id": 9,
			"created_at": "2026-06-07T17:03:32.593Z",
			"user_id": "3a2f6fce-ed18-4a9d-ab7e-84d52f01a050",
			"ab_str": 8,
			"ab_dex": 15,
			"ab_cha": 18,
			"ab_wis": 10,
			"ab_int": 14,
			"ab_con": 11,
			"name": "John doe",
			"items": [],
			"levels": [],
			"spells": []
		}
]```
### POST `/`
* Inserts a character into your account
* Body parts: `name, charisma, wisdom, intelligence, strength, dexterity, constitution`
* Example:
	* Input: `POST /character`, body: `{"name": "john doe", "charisma": 18,"wisdom": 10,"intelligence": 14,"strength": 8,"dexterity": 15,"constitution": 11 }`
	* Output: `"Personagem criado!"`
	* Notice if you try to create another character with the exact same name(case sensitive), it will return `{error: "Você já tem um personagem com esse nome!"}` with code 409
### GET `/specific/:character_id`
* Gets the info of a specific character you own.
* Example:
  * Input: `GET /character/specific/6`
  * Output: 
  ```json 
  {
	"character": {
		"id": 6,
		"ab_cha": 18,
		"ab_wis": 16,
		"ab_int": 18,
		"ab_str": 10,
		"ab_dex": 12,
		"ab_con": 11,
		"name": "Franco Zan"
	},
	"items": [
		{
			"item_id": 1,
			"id": 3
		}
	],
	"levels": [
		{
			"level": 20,
			"class_id": 1,
			"id": 7
		}
	],
	"spells": [
		{
			"id": 8,
			"spell_id": 1
		}
	]
  }```
### POST `/:character_id/item`
* Inserts an item onto a character
* Body parts: `item_id`
* Example:
  * Input: `POST character/6/item`, body: `{ item_id: 1 }`
  * Output: `"item adicionado!"`
### DELETE `/:character_id/item/:ch_item_id`
* Removes an item from a character
* Example:
  * Input: `DELETE /character/6/item/7`
  * Output: `"Item removido"`
### POST `/:character_id/level`
* Adds a specific amount of levels into a character, into a class
* Example: 
  * Input: `POST /character/6/level`, body: `"levels": 6, "class_id": 1`
  * Output: `"Nível criado no personagem de id 6"`
  * Note that if your character's total level will surpass 20, this blocks you with the error: `{error: "Seu personagem deve ter no máximo 20 níveis."}` with code 400.
### DELETE `/:character_id/level/:level_id`
* Removes levels from your character, using the id on the levels schema.
* Example: 
  * Input: `DELETE /character/6/level/8`
  * Output: `"Nível removido"`
### POST `/:character_id/spell`
* Inserts a spell into a character
* Body parts: `spell_id`
* Example:
  * Input: `POST /character/6/spell`, body: `"spell_id": 1`
  * Output: `Magia adicionada com sucesso!`
### GET `/:character_id/av_spells`
* Gets the spells a character of yours can have.
* Example:
  * Input: `GET /character/6/av_spells`
  * Output:
  ```json [
	{
		"name": "Danação",
		"id": 1
	}
  ]```
### GET `/:character_id/spells`
* Gets the spells of a certain character
* Example:
  * Input: `GET /character/6/spells`
  * Output: 
  ```json [
	{
		"name": "Danação",
		"description": "Blablabla vocer blablalba",
		"execution_time": "1 ação bônus",
		"range": "27 metros",
		"components": "V, S, M(um olho petrificado de salamandra)",
		"duration": "concentração, até uma hora",
		"level": 1,
		"own_id": 8
	}
  ] 
  ```
### DELETE `/:character_id/spell/:spell_id`
* Removes a spell from a character you own.
* Example:
  * Input: `DELETE /character/6/spell/8`
  * Output: 
  ```json{
	"success": true,
	"message": "Magia removida"
  }`
### PATCH `/:character`
* Updates characteristics of a character like name, attributes, etc.
* Example:
  * Input: `PATCH /character/:character_id`, body: `{	"name": "Lily Doe"  }`
  * Output: `"Personagem atualizado!"`
### DELETE `/:character_id`
* Deletes a character you own.
* Example: 
  * Input: `DELETE /character/7`
  * Output: `"Personagem deletado!"`

## classes
### GET `/`
* Gets a list of all classes in the game.
* Example: 
  * Input: `GET /classes`
  * Output: 
  ```json [
	{
		"name": "Bruxo",
		"id": 1
	},
	{
		"name": "Bárbaro",
		"id": 2
	},
	{
		"name": "Bardo",
		"id": 3
	},
	{
		"name": "Clérigo",
		"id": 4
	}
  ]
``
## info
### POST `/spells`
* Returns the list of spell info for an array of ids.
* Body parts: `spell_ids`, which is an array of numbers(the ids)
* Example:
    * Input: `POST /info/spells`, body: `{ "spell_ids":[1] }`
    * Output: 
    ```json [
	{
		"id": 1,
		"name": "Danação",
		"description": "Blablabla vocer blablalba",
		"execution_time": "1 ação bônus",
		"range": "27 metros",
		"components": "V, S, M(um olho petrificado de salamandra)",
		"duration": "concentração, até uma hora",
		"level": 1
	}
    ]```
## item-list
### GET `/item-list` 
* Returns a list of all items of the game.
* Example: 
  * Input: `GET /item-list`
  * Output: 
  ```json [
	{
		"name": "Adaga",
		"id": 1
	}
]
## profile
### GET `/profile`
* Returns the info of your profile.
* Example: 
  * Input: `GET /profile`
  * Output: 
  ```json {
	"nome_usuario": "Lilo",
	"foto_perfil": "asdfhjasdlfjk.png"
  }```

## roll
### GET `/roll`
* Returns a roll of dice.
* Query params: `type, amount`, both numbers
* Example: 
  * Input: `GET /roll?amount=6&type=10`
  * Output: 
  ```json {
	"all values": [
		10,
		9,
		10,
		10,
		7,
		2
	],
	"sum": 48
  }``` 
