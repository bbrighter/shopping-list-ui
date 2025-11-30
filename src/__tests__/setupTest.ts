import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect } from 'vitest';
import { handlers } from './handler';
import { getDefaultStore } from 'jotai';
import { locationAtom, productInstancesAtom } from '../store/authStore';



expect.extend(matchers);

export const server = setupServer(...handlers)

beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
    // // Uncomment to allow debugging more easily
    // server.events.on('request:start', ({ request }) => {
    //     console.log('➡️', request.method, request.url)
    //     console.log('   Headers:', Object.fromEntries(request.headers.entries()))
    // })
})
beforeEach(() => {
    const store = getDefaultStore()
    store.set(productInstancesAtom, [{ id: '68a06340-c811-4820-bb18-fbe750f24f4a', productId: 'prod-id', productName: 'prod', selected: true, url: '' }])
    store.set(locationAtom, { pathname: '/68a06340-c811-4820-bb18-fbe750f24f4a' })
})
afterEach(() => {
    server.resetHandlers()
    window.localStorage.clear()
})
afterAll(() => server.close())