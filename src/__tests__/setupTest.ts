import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect } from 'vitest';
import { handlers } from './handler';
import { getDefaultStore } from 'jotai';
import { piidAtom } from '../store/auth';


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
    store.set(piidAtom, '1234')
})
afterEach(() => {
    server.resetHandlers()
    window.localStorage.clear()
})
afterAll(() => server.close())