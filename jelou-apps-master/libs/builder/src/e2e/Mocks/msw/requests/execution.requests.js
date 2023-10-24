/** @typedef {import('msw').RestRequest<import('msw').DefaultBodyType, import('msw').PathParams<string>>} Req */
/** @typedef {import('msw').ResponseComposition<import('msw').DefaultBodyType>} Res */
/** @typedef {import('msw').RestContext} Ctx */

/**
 * @param {Req} req - The request object that was sent to the server.
 * @param {Res} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {Ctx} ctx - The context object that contains the request and response objects.
 */
export const execution = (req, res, ctx) => {
  return res(
    ctx.json({
      status: 1,
      message: ["Tool executed successfully."],
      statusMessage: "success",
      data: {
        output: {
          id: 30,
          name: "pokeOut",
          description: "Información del Pokémon",
          toolId: 40,
          type: "SUCCESS",
          state: true,
          required: true,
          createdAt: "2023-05-08T15:53:40.000Z",
          updatedAt: "2023-05-08T15:53:40.000Z",
          deletedAt: null,
          displayName: "Pokemones",
          value: {
            abilities: [
              {
                ability: { name: "limber", url: "https://pokeapi.co/api/v2/ability/7/" },
                is_hidden: false,
                slot: 1,
              },
              {
                ability: { name: "imposter", url: "https://pokeapi.co/api/v2/ability/150/" },
                is_hidden: true,
                slot: 3,
              },
            ],
            base_experience: 101,
            forms: [{ name: "ditto", url: "https://pokeapi.co/api/v2/pokemon-form/132/" }],
            height: 3,
            id: 132,
            is_default: true,
            location_area_encounters: "https://pokeapi.co/api/v2/pokemon/132/encounters",
            name: "ditto",
            order: 214,
            past_types: [],
            weight: 40,
          },
        },
      },
    })
  );
};
