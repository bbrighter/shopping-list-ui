import { http, HttpResponse } from 'msw'

import type { entity } from '../api/generatedApi'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMomentsHandler = (overrides?: HttpResponse<entity.MomentsResponse | any>) => (
    http.get('/piid/:piid/moments', () => {
        if (!overrides) {
            return HttpResponse.json({
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
            } as entity.MomentsResponse,
            { headers: { ETag: '123' } })
        }
        return overrides
    })
)

export const postListHandler = () => (http.post('/piid/:piid/list', () => (HttpResponse.json({ id: 2 }))))
export const postListItemHandler = () => (http.post('/piid/:piid/list/:listId/item', () => (HttpResponse.json({ id: 3 }))))
export const postListItemByIdHandler = () => (http.post('/piid/:piid/list/:listId/item/:itemId', () => (HttpResponse.json({ id: 3, productId: 3, listId: 1, checked: false }))))
export const patchCheckItemHandler = () => (http.patch('/piid/:piid/item/:itemId/check', () => (HttpResponse.json({}))))
export const deleteItemHandler = () => (http.delete('/piid/:piid/item/:itemId', () => (HttpResponse.json({}))))
export const deleteListHandler = () => (http.delete('/piid/:piid/list/:listId', ({ request }) => {
    const { force } = parseQuery(request)

    if (force == 'true') {
        return HttpResponse.json({})
    }
    return HttpResponse.json({}, { status: 400 })
}))
export const patchItemHandler = () => (http.patch('/piid/:piid/item/:itemId', () => (HttpResponse.json({}))))

function parseQuery(request: Request) {
    return Object.fromEntries(new URL(request.url).searchParams.entries())
}
