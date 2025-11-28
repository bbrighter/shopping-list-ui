import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect } from 'vitest';
import { handlers } from './handler';
import { getDefaultStore } from 'jotai';
import { selectedProductInstanceAtom } from '../store/authStore';



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
    store.set(selectedProductInstanceAtom, { id: '1234', productId: 'prod-id', productName: 'prod', selected: true, url: '' })
})
afterEach(() => {
    server.resetHandlers()
    window.localStorage.clear()
})
afterAll(() => server.close())