import { useAuth } from '@bbrighter/auth-module/auth'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { useSetAtom } from 'jotai'

import { fetchDataAtom } from '../../store'
import { ItemInput, ShoppingList } from './components'
import FinishListButton from './components/FinishListButton'
import usePolling from './hooks/usePolling.ts'

export default function Home() {
  const { piid } = useAuth()
  const fetchData = useSetAtom(fetchDataAtom)

  usePolling(fetchData, 4000, [piid, fetchData])

  return (
    <Container sx={{ padding: '2rem' }}>
      <Stack spacing={3}>
        <FinishListButton />
        <ItemInput />
        <ShoppingList />
      </Stack>
    </Container>
  )
}
