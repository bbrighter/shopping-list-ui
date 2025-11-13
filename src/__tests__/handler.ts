import { http, HttpResponse } from 'msw'
import type { entity } from '../api/generatedApi'

const BASE_URL = 'http://localhost:4444'
const BASE_URL_WITH_PIID = `${BASE_URL}/piid/:piid`

export const handlers = [
    http.get(BASE_URL_WITH_PIID + '/list', () => (HttpResponse.json({
        id: 1, items: [
            { id: 1, listId: 1, checked: false, productId: 1, quantity: 3 },
            { id: 2, listId: 1, checked: true, productId: 2 },
        ],
    } as entity.ListResponse)),
    ),
    http.get(BASE_URL_WITH_PIID + '/products', () => (HttpResponse.json({
        products: [
            { id: 1, name: 'prod1' },
            { id: 2, name: 'prod2' },
        ],
    } as entity.ProductListResponse)),
    ),
    http.get(BASE_URL + '/permissions', () => (HttpResponse.json({
        piid: 'ad0bd3b7-e017-4561-ae42-3a9d6444114f',
        appMapping: { 'shopping-list': true },
    } as entity.AuthProductInstance)),
    ),
    http.patch(BASE_URL_WITH_PIID + '/item/:itemId/check', () => (HttpResponse.json({}))),
    http.delete(BASE_URL_WITH_PIID + '/item/:itemId', () => (HttpResponse.json({}))),
    http.delete(BASE_URL_WITH_PIID + '/list/:listId', ({ request }) => {
        const { force } = parseQuery(request)

        if (force == 'true') {
            return HttpResponse.json({})
        }
        return HttpResponse.json({}, { status: 400 })
    }),
    http.patch(BASE_URL_WITH_PIID + '/item/:itemId', () => (HttpResponse.json({}))),
]

function parseQuery(request: Request) {
    return Object.fromEntries(new URL(request.url).searchParams.entries())
}