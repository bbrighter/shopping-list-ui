import { http, HttpResponse } from 'msw'
import type { entity } from '../api/generatedApi'


export const shoppingListHandlers = (url: string) => ([
    http.get(url + '/moments', () => HttpResponse.json({
        listId: 1,
        items: [
            { id: 1, listId: 1, checked: false, productId: 1, quantity: 3 },
            { id: 2, listId: 1, checked: true, productId: 2 },
        ],
        products: [
            { id: 1, name: 'prod1' },
            { id: 2, name: 'prod2' },
            { id: 3, name: 'prod3' },
        ],
    } as entity.MomentsResponse, {
        headers: {
            ETag: '123',
        },
    })),
    http.post(url + '/list', () => (HttpResponse.json({ ID: 2 }))),
    http.post(url + '/list/:listId/item', () => (HttpResponse.json({ id: 3 }))),
    http.post(url + '/list/:listId/item/:itemId', () => (HttpResponse.json({ id: 3, productId: 3, listId: 1, checked: false }))),
    http.patch(url + '/item/:itemId/check', () => (HttpResponse.json({}))),
    http.delete(url + '/item/:itemId', () => (HttpResponse.json({}))),
    http.delete(url + '/list/:listId', ({ request }) => {
        const { force } = parseQuery(request)

        if (force == 'true') {
            return HttpResponse.json({})
        }
        return HttpResponse.json({}, { status: 400 })
    }),
    http.patch(url + '/item/:itemId', () => (HttpResponse.json({}))),
])

function parseQuery(request: Request) {
    return Object.fromEntries(new URL(request.url).searchParams.entries())
}