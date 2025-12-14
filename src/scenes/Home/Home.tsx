import { useAtomValue, useSetAtom } from 'jotai'
import { fetchDataAtom, itemsWithNamesAtom } from '../../store'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Container from '@mui/material/Container'
import ItemInput from './components/ItemInput'
import ItemSecondaryAction from './components/ItemSecondaryAction'
import ItemCheckBox from './components/ItemCheckBox'
import FinishListButton from './components/FinishListButton'
import Stack from '@mui/material/Stack'
import usePolling from './hooks/usePolling.ts'
import { useAuth } from '@bbrighter/auth-module/auth'


export default function Home() {
    const { piid } = useAuth()
    const items = useAtomValue(itemsWithNamesAtom)
    const fetchData = useSetAtom(fetchDataAtom)

    usePolling(fetchData, 4000, [piid, fetchData])

    return (
        <Container sx={{ padding: '2rem' }}>
            <Stack spacing={3}>
                <FinishListButton />
                <ItemInput />
                <List >
                    {items.map(it => (
                        <ListItem
                            key={it.id}
                            secondaryAction={<ItemSecondaryAction item={it} />}
                        >
                            <ItemCheckBox item={it} />
                            <ListItemText primary={it.productName || 'no name'} secondary={it.quantity} />
                        </ListItem>
                    ))}
                </List>
            </Stack>
        </Container >
    )
}