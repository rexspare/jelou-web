/** @typedef {import('msw').RestRequest<import('msw').DefaultBodyType, import('msw').PathParams<string>>} Req */
/** @typedef {import('msw').ResponseComposition<import('msw').DefaultBodyType>} Res */
/** @typedef {import('msw').RestContext} Ctx */

/**
 * @param {Req} req - The request object that was sent to the server.
 * @param {Res} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {Ctx} ctx - The context object that contains the request and response objects.
 */
export const createEdge = (req, res, ctx) => {
  return res(
    ctx.json({
      status: 1,
      message: ["Edge retrieved successfully."],
      statusMessage: "success",
      data: createEdgeDataMock,
    }),
    ctx.status(201)
  );
};

/**
 * @param {Req} req - The request object that was sent to the server.
 * @param {Res} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {Ctx} ctx - The context object that contains the request and response objects.
 */
export const getAllEdges = (req, res, ctx) => {
  return res(
    ctx.json({
      status: 1,
      message: ["Edges retrieved successfully."],
      statusMessage: "success",
      data: updateEdgeDataMock,
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
export const deleteEdge = (req, res, ctx) => {
  const { edgeId } = req.params;

  if (edgeId === "nonexistentEdgeId") {
    return res(ctx.status(404));
  }

  return res(
    ctx.json({
      status: 1,
      message: ["Edge deleted successfully."],
      statusMessage: "success",
      data: null,
    }),
    ctx.status(200)
  );
};

export const createEdgeDataMock = {
  id: 380,
  type: "success",
  sourceId: 453,
  targetId: 451,
  workflowId: 10,
  configuration: {
    markerEnd: "customArrowEnd",
    sourceHandle: "success-453",
    targetHandle: "451",
  },
};

export const updateEdgeDataMock = [
  {
    id: 380,
    type: "success",
    sourceId: 453,
    targetId: 451,
    workflowId: 10,
    configuration: {
      markerEnd: "customArrowEnd",
      sourceHandle: "success-453",
      targetHandle: "451",
    },
    state: true,
    createdAt: "2023-03-25T06:15:04.000Z",
    updatedAt: "2023-03-25T06:15:04.000Z",
    deletedAt: null,
  },
  {
    id: 381,
    type: "success",
    sourceId: 453,
    targetId: 452,
    workflowId: 10,
    configuration: {
      markerEnd: "customArrowEnd",
      sourceHandle: "success-453",
      targetHandle: "452",
    },
    state: true,
    createdAt: "2023-03-25T06:15:04.000Z",
    updatedAt: "2023-03-25T06:15:04.000Z",
    deletedAt: null,
  },
];
