/** @typedef {import('msw').RestRequest<import('msw').DefaultBodyType, import('msw').PathParams<string>>} Req */
/** @typedef {import('msw').ResponseComposition<import('msw').DefaultBodyType>} Res */
/** @typedef {import('msw').RestContext} Ctx */

/**
 * @param {Req} req - The request object that was sent to the server.
 * @param {Res} res - The response object that you can use to set the response body, status code, headers,
 * etc.
 * @param {Ctx} ctx - The context object that contains the request and response objects.
 */
export const getAllWorkflows = (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      status: 1,
      message: [
        'workflows retrieved successfully.'
      ],
      statusMessage: 'success',
      data: [
        {
          id: 10,
          name: 'Send mesages from WhatsApp',
          type: 'CHATBOT',
          companyId: 135,
          initialState: null,
          configuration: {},
          state: true,
          createdAt: '2023-03-23T20:58:34.000Z',
          updatedAt: '2023-03-23T20:58:34.000Z',
          deletedAt: null
        },
        {
          id: 24,
          name: 'Multimedia',
          type: 'CHATBOT',
          companyId: 135,
          initialState: null,
          configuration: {},
          state: true,
          createdAt: '2023-04-06T16:28:12.000Z',
          updatedAt: '2023-04-06T16:28:12.000Z',
          deletedAt: null
        },
        {
          id: 25,
          name: 'Contacto',
          type: 'CHATBOT',
          companyId: 135,
          initialState: null,
          configuration: {},
          state: true,
          createdAt: '2023-04-11T17:55:01.000Z',
          updatedAt: '2023-04-11T17:55:01.000Z',
          deletedAt: null
        },
        {
          id: 26,
          name: 'Tool PMA 2',
          type: 'CHATBOT',
          companyId: 135,
          initialState: null,
          configuration: {},
          state: true,
          createdAt: '2023-04-14T21:50:20.000Z',
          updatedAt: '2023-04-14T21:50:20.000Z',
          deletedAt: null
        },
        {
          id: 29,
          name: 'Servicio de ejemplo 2',
          type: 'CHATBOT',
          companyId: 135,
          initialState: null,
          configuration: {},
          state: true,
          createdAt: '2023-04-21T20:51:43.000Z',
          updatedAt: '2023-04-21T20:51:43.000Z',
          deletedAt: null
        },
        {
          id: 30,
          name: 'Valentina test',
          type: 'CHATBOT',
          companyId: 135,
          initialState: null,
          configuration: {},
          state: true,
          createdAt: '2023-04-24T19:47:47.000Z',
          updatedAt: '2023-04-24T19:47:47.000Z',
          deletedAt: null
        }
      ]
    })
  )
}

// /**
//  * @param {Req} req - The request object that was sent to the server.
//  * @param {Res} res - The response object that you can use to set the response body, status code, headers,
//  * etc.
//  * @param {Ctx} ctx - The context object that contains the request and response objects.
//  */
// export const updateWorkflow = (req, res, ctx) => {
//   const { configuration } = req.body
//   return res(
//     ctx.status(200),
//     ctx.json({
//       status: 1,
//       message: ['Node updated successfully.'],
//       statusMessage: 'success',
//       data: {
//         id: 450,
//         workflowId: 10,
//         nodeTypeId: 7,
//         configuration,
//         posX: '832.0512416981359',
//         posY: '330.6359429589171',
//         comments: '',
//         state: true,
//         createdAt: '2023-03-25T04:09:45.000Z',
//         updatedAt: '2023-03-25T04:09:45.000Z',
//         deletedAt: null,
//         NodeType: {
//           id: 7,
//           type: 'IF',
//           displayNames: { en: 'IF', es: 'SI', pt: 'SE' },
//           state: true,
//           createdAt: '2022-12-27T21:58:44.000Z',
//           updatedAt: '2022-12-27T21:58:44.000Z',
//           deletedAt: null
//         }
//       }
//     })
//   )
// }
