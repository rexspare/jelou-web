/** @typedef {import('msw').RestRequest<import('msw').DefaultBodyType, import('msw').PathParams<string>>} Req */
/** @typedef {import('msw').ResponseComposition<import('msw').DefaultBodyType>} Res */
/** @typedef {import('msw').RestContext} Ctx */

/**
 * @param {Req} req - The request object that was sent to the server.
 * @param {Res} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {Ctx} ctx - The context object that contains the request and response objects.
 */
export const updateNodes = (req, res, ctx) => {
  const configuration = req.body.configuration;

  return res(
    ctx.json({
      status: 1,
      message: ["Node updated successfully."],
      statusMessage: "success",
      data: {
        id: 1151,
        workflowId: 48,
        nodeTypeId: 5,
        configuration,
        posX: "616.0103922015571",
        posY: "-603.5644024511859",
        comments: "",
        state: true,
        createdAt: "2023-05-18T18:47:43.000Z",
        updatedAt: "2023-05-18T18:47:43.000Z",
        deletedAt: null,
        NodeType: {
          id: 5,
          type: "CODE",
          displayNames: { en: "Code", es: "Código", pt: "Código" },
          state: true,
          createdAt: "2022-07-06T22:03:04.000Z",
          updatedAt: "2022-07-06T22:03:04.000Z",
          deletedAt: null,
        },
      },
    }),
    ctx.status(200)
  );
};
