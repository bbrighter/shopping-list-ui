/* v8 ignore file -- @preserve */
import { authHandlers } from './authHandler'
import * as shoppingListHandlers from './shoppingListHandler'
import { userManagementHandlers } from './userManagentHandler'

const BASE_URL = ''
const BASE_URL_WITH_PIID = `${BASE_URL}/piid/:piid`

export const handlers = [
    shoppingListHandlers.deleteItemHandler(),
    shoppingListHandlers.deleteListHandler(),
    shoppingListHandlers.getMomentsHandler(),
    shoppingListHandlers.patchCheckItemHandler(),
    shoppingListHandlers.postListHandler(),
    shoppingListHandlers.postListItemByIdHandler(),
    shoppingListHandlers.postListItemHandler(),
    shoppingListHandlers.patchItemHandler(),
    shoppingListHandlers.getProductsHandler(),
    ...authHandlers(BASE_URL),
    ...userManagementHandlers(BASE_URL_WITH_PIID),
]
