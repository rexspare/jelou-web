export const OPERATORS_DATA_MOCK = [
  {
    id: 579,
    names: 'Luigi Basantes',
    email: 'luigi@01lab.co',
    companyId: 135,
    providerId: '3accf074-a20e-41ec-bc2a-fe2d70654275',
    loggedInAt: '2023-03-15T12:02:17.000Z',
    properties: null,
    loggedOutAt: '2023-04-27T18:25:01.000Z',
    active: 1,
    status: 'offline',
    User: {
      id: 10,
      names: 'Luigi Basantes',
      lang: 'es',
      email: 'luigi@01lab.co',
      emailVerified: null,
      companyId: 135,
      active: 'offline',
      state: true,
      providerId: '3accf074-a20e-41ec-bc2a-fe2d70654275',
      recoverToken: 'f32030c3d711b4e57a415249dff53bfab5fdff5f',
      recoverTokenExpires: '2022-03-17T22:44:33.000Z',
      googleToken: null,
      facebookToken: null,
      externalToken: null,
      operatorActive: 'offline',
      createdBy: null,
      properties: null,
      shouldReceiveEmail: null,
      isMigrated: false,
      isOperator: true,
      operatorId: 579,
      timezone: 'America/Guayaquil',
      monitorAllTeams: true,
      loggedInAt: '2023-05-06T16:09:08.000Z',
      loggedOutAt: '2023-04-27T18:25:01.000Z',
      deletedAt: null,
      createdAt: '2018-12-11T17:01:40.000Z',
      updatedAt: '2023-05-06T21:09:08.000Z'
    },
    deletedAt: null,
    team: 'Frontend,Backend'
  },
  {
    id: 577,
    names: 'Fernando Sanchez',
    email: 'fernando@jelou.ai',
    companyId: 135,
    providerId: 'e016e8f2-e22a-43b7-9d8c-68ace247aec8',
    loggedInAt: '2023-01-26T17:16:25.000Z',
    properties: null,
    loggedOutAt: '2023-04-21T17:40:00.000Z',
    active: 1,
    status: 'offline',
    User: {
      id: 52,
      names: 'Fernando Sanchez',
      lang: 'es',
      email: 'fernando@jelou.ai',
      emailVerified: null,
      companyId: 135,
      active: 'offline',
      state: true,
      providerId: 'e016e8f2-e22a-43b7-9d8c-68ace247aec8',
      recoverToken: 'b2048ec2f1baab108d72976223d25c441de1d95e',
      recoverTokenExpires: '2022-10-31T19:47:02.000Z',
      googleToken: null,
      facebookToken: null,
      externalToken: null,
      operatorActive: 'offline',
      createdBy: null,
      properties: null,
      shouldReceiveEmail: null,
      isMigrated: false,
      isOperator: true,
      operatorId: 577,
      timezone: 'America/Guayaquil',
      monitorAllTeams: true,
      loggedInAt: '2023-05-06T11:07:16.000Z',
      loggedOutAt: '2023-04-21T17:40:00.000Z',
      deletedAt: null,
      createdAt: '2019-05-17T17:04:30.000Z',
      updatedAt: '2023-05-06T16:07:16.000Z'
    },
    deletedAt: null,
    team: 'Servicio al Cliente,Backend'
  },
  {
    id: 573,
    names: 'Alix Ferrín',
    email: 'alix@01lab.co',
    companyId: 135,
    providerId: '84c7e664-a85b-403e-a74a-9029bb2e153c',
    loggedInAt: '2023-04-11T12:28:51.000Z',
    properties: null,
    loggedOutAt: '2023-05-04T15:17:07.000Z',
    active: 1,
    status: 'offline',
    User: {
      id: 99,
      names: 'Alix Ferrín',
      lang: 'es',
      email: 'alix@01lab.co',
      emailVerified: null,
      companyId: 135,
      active: 'offline',
      state: true,
      providerId: '84c7e664-a85b-403e-a74a-9029bb2e153c',
      recoverToken: null,
      recoverTokenExpires: null,
      googleToken: '112467212932599147782',
      facebookToken: null,
      externalToken: null,
      operatorActive: 'offline',
      createdBy: null,
      properties: null,
      shouldReceiveEmail: null,
      isMigrated: false,
      isOperator: true,
      operatorId: 573,
      timezone: 'America/Guayaquil',
      monitorAllTeams: true,
      loggedInAt: '2023-05-05T11:36:02.000Z',
      loggedOutAt: '2023-05-04T15:17:07.000Z',
      deletedAt: null,
      createdAt: '2019-12-17T21:22:41.000Z',
      updatedAt: '2023-05-05T16:36:02.000Z'
    },
    deletedAt: null,
    team: 'Frontend,Support Email,Publicaciones'
  }
]

export const TEAMS_DATA_MOCK = {
  pagination: { limit: 200, total: 21, offset: 0, totalPages: 1 },
  _metadata: {},
  results: [
    {
      id: 164,
      name: 'Backend',
      properties: {
        views: ['chats'],
        operatorView: {
          workingDays: ['1', '2', '3', '4', '5'],
          isEnableWorkingDays: true,
          workingDaysDetailed: {
            1: { finalHour: '18:00', initialHour: '09:00' },
            2: { finalHour: '18:00', initialHour: '09:00' },
            3: { finalHour: '18:00', initialHour: '09:00' },
            4: { finalHour: '18:00', initialHour: '09:00' },
            5: { finalHour: '18:00', initialHour: '09:00' }
          }
        }
      },
      companyId: 135,
      state: true,
      createdAt: '2020-09-07T20:32:12.000Z',
      updatedAt: '2023-04-25T15:37:31.000Z',
      deletedAt: null
    },
    {
      id: 165,
      name: 'Frontend',
      properties: {
        views: ['chats'],
        operatorView: {
          workingDays: ['1', '2', '3', '4'],
          isEnableWorkingDays: false,
          workingDaysDetailed: {
            1: { finalHour: '23:00', initialHour: '06:00' },
            2: { finalHour: '23:00', initialHour: '06:00' },
            3: { finalHour: '23:00', initialHour: '06:00' },
            4: { finalHour: '23:00', initialHour: '06:00' }
          }
        }
      },
      companyId: 135,
      state: true,
      createdAt: '2020-09-07T20:32:12.000Z',
      updatedAt: '2023-01-23T17:50:47.000Z',
      deletedAt: null
    },
    {
      id: 166,
      name: 'Support',
      properties: {
        views: ['chats'],
        operatorView: {
          workingDays: ['1', '2', '3', '4', '5', '6', '0'],
          isEnableWorkingDays: true,
          workingDaysDetailed: {
            0: { finalHour: '07:00', initialHour: '04:00' },
            1: { finalHour: '01:00', initialHour: '00:00' },
            2: { finalHour: '01:00', initialHour: '00:00' },
            3: { finalHour: '01:00', initialHour: '00:00' },
            4: { finalHour: '01:45', initialHour: '00:45' },
            5: { finalHour: '01:45', initialHour: '00:45' },
            6: { finalHour: '07:00', initialHour: '04:00' }
          }
        }
      },
      companyId: 135,
      state: true,
      createdAt: '2020-09-07T20:32:12.000Z',
      updatedAt: '2022-03-18T16:32:43.000Z',
      deletedAt: null
    },
    {
      id: 399,
      name: 'Publicaciones',
      properties: { views: ['posts'] },
      companyId: 135,
      state: true,
      createdAt: '2022-04-07T16:56:58.000Z',
      updatedAt: '2022-04-07T16:56:58.000Z',
      deletedAt: null
    },
    {
      id: 551,
      name: 'Support Email',
      properties: { views: ['emails'], supportTickets: { foo: 'bar' } },
      companyId: 135,
      state: true,
      createdAt: '2022-09-02T12:32:12.000Z',
      updatedAt: '2022-09-02T12:32:12.000Z',
      deletedAt: null
    }
  ],
  links: [{ number: 1, url: '/v1/companies/135/teams?limit=200&page=1' }]
}
