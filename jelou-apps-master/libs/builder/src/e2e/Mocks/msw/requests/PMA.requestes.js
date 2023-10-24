/** @typedef {import('msw').ResponseComposition<import('msw').DefaultBodyType>} Res */
/** @typedef {import('msw').RestContext} Ctx */

import { OPERATORS_DATA_MOCK, TEAMS_DATA_MOCK } from "@mocks/PMA.dataMock";

/**
 * @param {Req} req - The request object that was sent to the server.
 * @param {Res} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {Ctx} ctx - The context object that contains the request and response objects.
 */
export const getTeams = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(TEAMS_DATA_MOCK));
};

/**
 * @param {Req} req - The request object that was sent to the server.
 * @param {Res} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {Ctx} ctx - The context object that contains the request and response objects.
 */
export const getOperators = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(OPERATORS_DATA_MOCK));
};
