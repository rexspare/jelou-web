import { vi } from 'vitest'

export const workflowsMock = {
  status: 1,
  message: ['workflows retrieved successfully.'],
  statusMessage: 'success',
  data: [
    {
      id: 1,
      name: 'Receive updates from Telegram and send an image',
      type: 'CHATBOT',
      companyId: 135,
      initialState: '123,3123,4143;123123',
      configuration: { property1: 'valor1' },
      state: true,
      createdAt: '2022-06-17T22:10:45.000Z',
      updatedAt: '2022-06-17T22:10:45.000Z',
      deletedAt: null
    },
    {
      id: 2,
      name: 'Send a daily summary of your Google Calendar events to Slack',
      type: 'RPA',
      companyId: 135,
      initialState: '123,3123,4143;123123',
      configuration: { property1: 'valor12' },
      state: true,
      createdAt: '2022-06-17T22:22:17.000Z',
      updatedAt: '2022-06-17T22:22:17.000Z',
      deletedAt: null
    },
    {
      id: 3,
      name: 'Transcribe audio files from Cloud Storage',
      type: 'RPA',
      companyId: 135,
      initialState: '123,3123,4143;123123',
      configuration: { property1: 'valor123' },
      state: true,
      createdAt: '2022-06-17T23:06:47.000Z',
      updatedAt: '2022-06-17T23:06:47.000Z',
      deletedAt: null
    },
    {
      id: 4,
      name: 'Send WhatsApp users to PMA',
      type: 'CHATBOT',
      companyId: 135,
      initialState: '123,3123,4143;123123',
      configuration: { property1: 'valor1235' },
      state: true,
      createdAt: '2022-06-20T21:57:01.000Z',
      updatedAt: '2022-06-20T21:57:01.000Z',
      deletedAt: null
    },
    {
      id: 5,
      name: 'Multiagent Panel',
      type: 'CHATBOT',
      companyId: 135,
      initialState: null,
      configuration: { foo: 'bar' },
      state: true,
      createdAt: '2023-01-16T19:31:46.000Z',
      updatedAt: '2023-01-16T19:31:46.000Z',
      deletedAt: null
    },
    {
      id: 6,
      name: 'API call workshop',
      type: 'CHATBOT',
      companyId: 135,
      initialState: null,
      configuration: { foo: 'bar' },
      state: true,
      createdAt: '2023-02-09T21:43:35.000Z',
      updatedAt: '2023-02-09T21:43:35.000Z',
      deletedAt: null
    },
    {
      id: 7,
      name: 'Default',
      type: 'CHATBOT',
      companyId: 135,
      initialState: null,
      configuration: {},
      state: true,
      createdAt: '2023-02-27T15:57:08.000Z',
      updatedAt: '2023-02-27T15:57:08.000Z',
      deletedAt: null
    },
    {
      id: 8,
      name: 'Testing',
      type: 'CHATBOT',
      companyId: 135,
      initialState: null,
      configuration: {},
      state: true,
      createdAt: '2023-02-27T15:57:41.000Z',
      updatedAt: '2023-02-27T15:57:41.000Z',
      deletedAt: null
    },
    {
      id: 9,
      name: 'Test Http node',
      type: 'CHATBOT',
      companyId: 135,
      initialState: null,
      configuration: {},
      state: true,
      createdAt: '2023-03-02T16:30:12.000Z',
      updatedAt: '2023-03-02T16:30:12.000Z',
      deletedAt: null
    }
  ]
}

export const workflowMock = {
  status: 1,
  message: ['workflows retrieved successfully.'],
  statusMessage: 'success',
  data: {
    id: 5,
    name: 'Multiagent Panel',
    type: 'CHATBOT',
    companyId: 135,
    initialState: null,
    configuration: { foo: 'bar' },
    state: true,
    createdAt: '2023-01-16T19:31:46.000Z',
    updatedAt: '2023-01-16T19:31:46.000Z',
    deletedAt: null
  }
}

export const nodesMock = {
  status: 1,
  message: ['Nodes retrieved successfully.'],
  statusMessage: 'success',
  data: [
    {
      id: 95,
      workflowId: 1,
      nodeTypeId: 1,
      configuration: {},
      posX: '-191.52819277244666',
      posY: '146.49210267871473',
      comments: 'Nodo Start',
      state: true,
      createdAt: '2022-06-21T21:58:36.000Z',
      updatedAt: '2022-06-21T21:58:36.000Z',
      deletedAt: null,
      NodeType: {
        id: 1,
        displayNames: { en: 'Start', es: 'Inicio', pt: 'Começar' },
        type: 'START'
      }
    },
    {
      id: 274,
      workflowId: 1,
      nodeTypeId: 3,
      configuration: {
        title: 'Enviar mensaje',
        messages: [
          { id: 'dgAGfFWGeIMaks6ovvxHU', text: '', type: 'text' },
          {
            id: 'qfeD3KkbD8O0sZlQDi4vp',
            text: null,
            type: 'buttons',
            options: [
              {
                id: 'vWkxqhbT81oBS2wGmFFVG',
                url: null,
                type: 'postback',
                title: null,
                payload: null,
                phone_number: null
              }
            ]
          },
          { id: 'x20KEPpI5qyadGR9XRr_l', type: 'image', caption: null, mediaUrl: null }
        ]
      },
      posX: '171',
      posY: '106',
      comments: '',
      state: true,
      createdAt: '2023-02-14T21:33:56.000Z',
      updatedAt: '2023-02-14T21:33:56.000Z',
      deletedAt: null,
      NodeType: {
        id: 3,
        displayNames: { en: 'Send message', es: 'Enviar mensaje', pt: 'Enviar mensagem' },
        type: 'CHANNEL_MESSAGE'
      }
    },
    {
      id: 275,
      workflowId: 1,
      nodeTypeId: 3,
      configuration: {
        messages: [
          {
            id: 'U0La_6ZuAF1QuEZrA7Nxo',
            text: null,
            type: 'buttons',
            options: [
              {
                id: 'bMTZQ3t2fWJUZT8dwrkaU',
                url: null,
                type: 'postback',
                title: null,
                payload: null
              }
            ]
          }
        ]
      },
      posX: '241',
      posY: '529',
      comments: '',
      state: true,
      createdAt: '2023-02-14T21:34:19.000Z',
      updatedAt: '2023-02-14T21:34:19.000Z',
      deletedAt: null,
      NodeType: {
        id: 3,
        displayNames: { en: 'Send message', es: 'Enviar mensaje', pt: 'Enviar mensagem' },
        type: 'CHANNEL_MESSAGE'
      }
    }
  ]
}

export const edgeMock = {
  status: 1,
  message: ['Edges retrieved successfully.'],
  statusMessage: 'success',
  data: [
    {
      id: 264,
      type: 'default',
      sourceId: 95,
      targetId: 274,
      workflowId: 1,
      configuration: { markerEnd: 'customArrowEnd', sourceHandle: null, targetHandle: '274' },
      state: true,
      createdAt: '2023-02-14T21:35:54.000Z',
      updatedAt: '2023-02-14T21:35:54.000Z',
      deletedAt: null,
      NodeSource: {
        id: 95,
        workflowId: 1,
        nodeTypeId: 1,
        configuration: {},
        posX: '-191.52819277244666',
        posY: '146.49210267871473',
        comments: 'Nodo Start',
        state: true,
        createdAt: '2022-06-21T21:58:36.000Z',
        updatedAt: '2022-06-21T21:58:36.000Z',
        deletedAt: null
      },
      NodeTarget: {
        id: 274,
        workflowId: 1,
        nodeTypeId: 3,
        configuration: {
          title: 'Enviar mensaje',
          messages: [
            { id: 'dgAGfFWGeIMaks6ovvxHU', text: '', type: 'text' },
            {
              id: 'qfeD3KkbD8O0sZlQDi4vp',
              text: null,
              type: 'buttons',
              options: [
                {
                  id: 'vWkxqhbT81oBS2wGmFFVG',
                  url: null,
                  type: 'postback',
                  title: null,
                  payload: null,
                  phone_number: null
                }
              ]
            },
            { id: 'x20KEPpI5qyadGR9XRr_l', type: 'image', caption: null, mediaUrl: null }
          ]
        },
        posX: '171',
        posY: '106',
        comments: '',
        state: true,
        createdAt: '2023-02-14T21:33:56.000Z',
        updatedAt: '2023-02-14T21:33:56.000Z',
        deletedAt: null
      }
    },
    {
      id: 265,
      type: 'default',
      sourceId: 95,
      targetId: 275,
      workflowId: 1,
      configuration: { markerEnd: 'customArrowEnd', sourceHandle: null, targetHandle: '275' },
      state: true,
      createdAt: '2023-02-14T21:35:57.000Z',
      updatedAt: '2023-02-14T21:35:57.000Z',
      deletedAt: null,
      NodeSource: {
        id: 95,
        workflowId: 1,
        nodeTypeId: 1,
        configuration: {},
        posX: '-191.52819277244666',
        posY: '146.49210267871473',
        comments: 'Nodo Start',
        state: true,
        createdAt: '2022-06-21T21:58:36.000Z',
        updatedAt: '2022-06-21T21:58:36.000Z',
        deletedAt: null
      },
      NodeTarget: {
        id: 275,
        workflowId: 1,
        nodeTypeId: 3,
        configuration: {
          messages: [
            {
              id: 'U0La_6ZuAF1QuEZrA7Nxo',
              text: null,
              type: 'buttons',
              options: [
                {
                  id: 'bMTZQ3t2fWJUZT8dwrkaU',
                  url: null,
                  type: 'postback',
                  title: null,
                  payload: null
                }
              ]
            }
          ]
        },
        posX: '241',
        posY: '529',
        comments: '',
        state: true,
        createdAt: '2023-02-14T21:34:19.000Z',
        updatedAt: '2023-02-14T21:34:19.000Z',
        deletedAt: null
      }
    }
  ]
}

export const contactMock = [
  {
    addresses: [
      {
        id: '1',
        street: '',
        type: ''
      }
    ],
    emails: [
      {
        id: '2',
        email: 'davidperjac@hotmail.com',
        type: 'WORK'
      }
    ],
    name: {
      first_name: '',
      formatted_name: '',
      last_name: ''
    },
    org: {
      company: '',
      department: '',
      title: ''
    },
    phones: [
      {
        id: '3',
        phone: '',
        type: ''
      }
    ],
    urls: [
      {
        id: '4',
        url: '',
        type: ''
      }
    ]
  }
]

export const emptyContextDataMock = {
  error: null,
  search: '',
  isError: false,
  isLoading: false,
  handleSearch: vi.fn(),
  deleteServiceId: null,
  serviceTypeFilter: null,
  isOpenCreateModal: false,
  isOpenDeleteModal: false,
  worflowsSortOrder: null,
  setDeleteServiceId: vi.fn(),
  refreshServicesList: vi.fn(),
  setIsOpenDeleteModal: vi.fn(),
  setServiceTypeFilter: vi.fn(),
  setIsOpenCreateModal: vi.fn(),
  setWorkflowsSortOrder: vi.fn(),
  workflows: []
}

export const contextDataMock = {
  error: null,
  search: '',
  isError: false,
  isLoading: false,
  handleSearch: vi.fn(),
  deleteServiceId: null,
  serviceTypeFilter: null,
  isOpenCreateModal: false,
  isOpenDeleteModal: false,
  worflowsSortOrder: null,
  setDeleteServiceId: vi.fn(),
  refreshServicesList: vi.fn(),
  setIsOpenDeleteModal: vi.fn(),
  setServiceTypeFilter: vi.fn(),
  setIsOpenCreateModal: vi.fn(),
  setWorkflowsSortOrder: vi.fn(),
  workflows: workflowsMock.data
}

export const toolMock = {
  id: 40,
  name: 'Fernando tool',
  description: 'Esto es un test',
  toolkitId: 3,
  workflowId: 48,
  state: true,
  createdAt: '2023-05-05T16:49:45.000Z',
  updatedAt: '2023-05-05T16:49:45.000Z',
  deletedAt: null,
  configuration: {
    thumbnail: 'https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/workflows-24/image/dMCfaWwELKRBAycnnljfh.png',
    principalColor: '#E6F6F9',
    complementaryColor: '#00B3C7'
  },
  Inputs: [],
  Outputs: [
    {
      id: 30,
      name: 'ferTool',
      description: 'Este es la salida de sucess',
      toolId: 40,
      type: 'SUCCESS',
      state: true,
      required: false,
      createdAt: '2023-05-08T15:53:40.000Z',
      updatedAt: '2023-05-08T15:53:40.000Z',
      deletedAt: null,
      displayName: 'Success'
    }
  ]
}
