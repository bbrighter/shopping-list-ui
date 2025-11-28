import { http, HttpResponse } from 'msw'
import type { entity } from '../api/generatedApi'


export const authHandlers = (url: string) => ([
    http.get(url + '/permissions', () => (HttpResponse.json({
        userId: '123',
        userName: 'user 1',
        instances: [
            {
                piid: 'ad0bd3b7-e017-4561-ae42-3a9d6444114f',
                appMapping: { 'shopping-list': true },
                product: 'shopping-list',
            },
        ],
    } as entity.AuthData)),
    ),
])
