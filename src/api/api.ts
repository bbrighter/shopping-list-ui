import { fetcher } from './fetcher'
import Client, { type ClientOptions, Environment, Local } from './generatedApi'

const getStageURL = (): string => {
  const hostname = new URL(window.location.href).hostname
  if (hostname.includes('shopping-list-ui-git')) {
    return Environment('staging')
  }
  else {
    return Environment('prod')
  }
}

const baseUrl = import.meta.env.MODE === 'test'
  ? 'http://localhost:4444'
  : import.meta.env.PROD
    ? getStageURL()
    : Local

const options: ClientOptions = {
  fetcher: fetcher,
  auth: () => ({ Token: window.localStorage.getItem('new-token') || '' }),
}

const baseClient = new Client(baseUrl, options)
export const authApi = baseClient.authentication
export const api = baseClient.shoppinglist
