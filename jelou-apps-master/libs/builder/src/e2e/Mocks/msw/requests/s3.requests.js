import { S3_DELETE_URL_TEST } from "../../../../libs/s3/s3.test";

/**
 * It takes a request, a response, and a context, and returns a response with a body of a URL and a
 * status of 200
 * @param {import('msw').RestRequest<import('msw').DefaultBodyType, import('msw').PathParams<string>>} req - The request object that was sent to the server.
 * @param {import('msw').ResponseComposition<import('msw').DefaultBodyType>} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {import('msw').RestContext} ctx - The context object that contains the request and response objects.
 */
export const createS3URL = (req, res, ctx) => {
  return res(ctx.body("https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/workflows-workflow456/image/T7iNyELkdut87eV_0yUJe.jpeg"), ctx.status(200));
};

/**
 * @param {import('msw').RestRequest<import('msw').DefaultBodyType, import('msw').PathParams<string>>} req - The request object that was sent to the server.
 * @param {import('msw').ResponseComposition<import('msw').DefaultBodyType>} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {import('msw').RestContext} ctx - The context object that contains the request and response objects.
 */
export const deleteS3URL = (req, res, ctx) => {
  const urlToDelete = req.url.searchParams.get("url");

  if (urlToDelete !== S3_DELETE_URL_TEST) {
    return res(ctx.body("URL does not exist"), ctx.status(404));
  }

  return res(ctx.body("URL deleted"), ctx.status(200));
};
