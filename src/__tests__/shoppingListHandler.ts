/* v8 ignore file -- @preserve */
import { http, HttpResponse } from 'msw'

import type { shoppinglist } from '../api/api'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMomentsHandler = (overrides?: HttpResponse<shoppinglist.MomentsResponse | any>) => (
    http.get('/piid/:piid/moments', () => {
        if (!overrides) {
            return HttpResponse.json({
                itemsVersion: 0, productsVersion: 0,
            } satisfies shoppinglist.MomentsResponse,
            )
        }
        return overrides
    })
)

export const postListHandler = () => (http.post('/piid/:piid/list', () => (HttpResponse.json(
    { id: 2, items: [
        { id: 1, checked: false, productId: 1, quantity: 3 },
        { id: 2, checked: true, productId: 2 },
    ] } satisfies shoppinglist.ListResponse,
))))

export const postListItemHandler = () => (http.post('/piid/:piid/list/:listId/item', () => (HttpResponse.json(
    { id: 3, checked: false, productId: 4 } satisfies shoppinglist.ItemResponse,
))))

export const postListItemByIdHandler = () => (http.post('/piid/:piid/list/:listId/item/:itemId', () => (HttpResponse.json(
    { id: 3 } satisfies shoppinglist.IdResponse,
))))

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

export const getProductsHandler = () => (http.get('/piid/:piid/products', () => (HttpResponse.json(
    { products: [
        { id: 1, name: 'prod1', archived: false },
        { id: 2, name: 'prod2', archived: false },
        { id: 3, name: 'prod3', archived: true },
    ] } satisfies shoppinglist.ProductListResponse,
))))

function parseQuery(request: Request) {
    return Object.fromEntries(new URL(request.url).searchParams.entries())
}
