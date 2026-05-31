/* v8 ignore file -- @preserve */
import { authHandlers } from './authHandler'
import { itemHandlers, listHandlers, momentsHandler, productHandlers } from './shoppingListHandler'
import { userManagementHandlers } from './userManagentHandler'

const BASE_URL = ''
const BASE_URL_WITH_PIID = `${BASE_URL}/piid/:piid`

export const handlers = [
    listHandlers.post(),
    listHandlers.delete(),
    momentsHandler.get(),
    itemHandlers.postItemById(),
    itemHandlers.putItemByName(),
    itemHandlers.delete(),
    itemHandlers.patch(),
    itemHandlers.patchCheck(),
    productHandlers.list(),
    productHandlers.delete(),
    productHandlers.patch(),
    ...authHandlers(BASE_URL),
    ...userManagementHandlers(BASE_URL_WITH_PIID),
]
