import { http, HttpResponse } from 'msw'

import type { entity } from '../api/generatedApi'

export const authHandlers = (url: string) => ([
  http.get(url + '/permissions', () => (HttpResponse.json({
    userId: '123',
    userName: 'user 1',
    instances: [
      {
        piid: '68a06340-c811-4820-bb18-fbe750f24f4a',
        appMapping: { 'shopping-list': true },
        product: 'shopping-list',
      },
    ],
  } as entity.AuthData)),
  ),
])
