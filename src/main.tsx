import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { AuthProvider } from '@bbrighter/auth-module'
import { authApi } from './api/api.ts'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider api={authApi} productKey='shopping-list'>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
