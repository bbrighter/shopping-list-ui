import { shoppingListHandlers } from './shoppingListHandler'
import { authHandlers } from './authHandler'
import { userManagementHandlers } from './userManagentHandler'

const BASE_URL = 'http://localhost:4444'
const BASE_URL_WITH_PIID = `${BASE_URL}/piid/:piid`

export const handlers = [
    ...shoppingListHandlers(BASE_URL_WITH_PIID),
    ...authHandlers(BASE_URL),
    ...userManagementHandlers(BASE_URL_WITH_PIID),
]
