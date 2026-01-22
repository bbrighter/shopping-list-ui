import { render, screen, waitFor } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { Router } from 'wouter'
import { memoryLocation } from 'wouter/memory-location'

import { server } from './__tests__/setupTest'
import type { entity } from './api/generatedApi'
import App from './App'

describe('app', () => {
    const renderApp = (path: string) => {
        const { hook, searchHook } = memoryLocation({ path: path, static: true })
        render(<Router hook={hook} searchHook={searchHook}><App /></Router>)
    }

    it('spinner while getting permissions', async () => {
        server.use(http.get('/piid/:piid/moments', async () => {
            await delay(500)
            return HttpResponse.json(
                { items: [], listId: 1, products: [], ETag: 'etag' } satisfies entity.MomentsResponse,
                { headers: { ETag: '123' } },
            )
        }))

        renderApp('/68a06340-c811-4820-bb18-fbe750f24f4a')

        const backdrop = screen.getAllByTestId('loader-backdrop')[0]
        expect(backdrop).toBeInTheDocument()

        await waitFor(
            () => expect(backdrop).toBeVisible(),
        )
        await waitFor(
            () => expect(backdrop).not.toBeVisible(),
        )
    })
})
