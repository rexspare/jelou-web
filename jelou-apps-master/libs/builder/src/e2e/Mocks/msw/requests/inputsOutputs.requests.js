/** @typedef {import('msw').RestRequest<import('msw').DefaultBodyType, import('msw').PathParams<string>>} Req */
/** @typedef {import('msw').ResponseComposition<import('msw').DefaultBodyType>} Res */
/** @typedef {import('msw').RestContext} Ctx */

/**
 * @param {Req} req - The request object that was sent to the server.
 * @param {Res} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {Ctx} ctx - The context object that contains the request and response objects.
 */
export const createInput = (req, res, ctx) => {
  if (req.body.name === "error") {
    return res(ctx.status(400));
  }

  return res(
    ctx.body(
      JSON.stringify({
        status: 1,
        message: ["Tool Input created successfully."],
        statusMessage: "success",
        data: {
          id: 12,
          name: "Edad",
          description: "Edad del usuario",
          toolId: 21,
          type: "NUMBER",
          state: true,
          required: 0,
          createdAt: "2023-04-29T03:27:54.000Z",
          updatedAt: "2023-04-29T03:27:54.000Z",
          deletedAt: null,
        },
      })
    ),
    ctx.status(201)
  );
};

/**
 * @param {Req} req - The request object that was sent to the server.
 * @param {Res} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {Ctx} ctx - The context object that contains the request and response objects.
 */
export const updateInput = (req, res, ctx) => {
  // @ts-ignore
  if (req.body.name === "error") {
    return res(ctx.status(400));
  }

  return res(
    ctx.body(
      JSON.stringify({
        status: 1,
        message: ["Tool Input created successfully."],
        statusMessage: "success",
        data: {
          id: 12,
          name: "Edad",
          description: "Edad del usuario",
          toolId: 21,
          type: "NUMBER",
          state: true,
          required: 0,
          createdAt: "2023-04-29T03:27:54.000Z",
          updatedAt: "2023-04-29T03:27:54.000Z",
          deletedAt: null,
        },
      })
    ),
    ctx.status(200)
  );
};

/**
 * @param {Req} req - The request object that was sent to the server.
 * @param {Res} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {Ctx} ctx - The context object that contains the request and response objects.
 */
export const getInputs = (req, res, ctx) => {
  return res(
    ctx.body(
      JSON.stringify({
        status: 1,
        message: ["inputs retrieved successfully."],
        statusMessage: "success",
        data: [
          {
            id: 19,
            name: "name",
            description: "Nombre del usuario",
            toolId: 21,
            type: "STRING",
            state: true,
            required: true,
            createdAt: "2023-05-04T00:09:22.000Z",
            updatedAt: "2023-05-04T00:09:22.000Z",
            deletedAt: null,
            displayName: "Nombre",
          },
          {
            id: 20,
            name: "years",
            description: "Edad del usuario",
            toolId: 21,
            type: "NUMBER",
            state: true,
            required: false,
            createdAt: "2023-05-04T00:11:29.000Z",
            updatedAt: "2023-05-04T00:11:29.000Z",
            deletedAt: null,
            displayName: "Edad",
          },
        ],
      })
    ),
    ctx.status(200)
  );
};

/**
 * @param {Req} req - The request object that was sent to the server.
 * @param {Res} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {Ctx} ctx - The context object that contains the request and response objects.
 */
export const deleteInput = (req, res, ctx) => {
  if (req.params.inputId === "0") {
    return res(ctx.status(400));
  }

  return res(
    ctx.json({
      status: 1,
      message: ["Tool Input deleted successfully."],
      statusMessage: "success",
      data: {
        count: 1,
      },
    }),
    ctx.status(200)
  );
};

/**
 * @param {Req} req - The request object that was sent to the server.
 * @param {Res} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {Ctx} ctx - The context object that contains the request and response objects.
 */
export const deleteOutput = (req, res, ctx) => {
  if (req.params.outputId === "0") {
    return res(ctx.status(400));
  }

  return res(
    ctx.json({
      status: 1,
      message: ["Tool Input deleted successfully."],
      statusMessage: "success",
      data: {
        count: 1,
      },
    }),
    ctx.status(200)
  );
};
