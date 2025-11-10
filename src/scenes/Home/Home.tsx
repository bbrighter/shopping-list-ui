import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { fetchListAtom, itemsWithNamesAtom } from '../../store/items'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { piidAtom } from '../../store/auth'
import Container from '@mui/material/Container'
import ItemInput from './components/ItemInput'
import ItemSecondaryAction from './components/ItemSecondaryAction'
import { fetchProducts } from '../../store/products'
import ItemCheckBox from './components/ItemCheckBox'

export default function Home() {
    const piid = useAtomValue(piidAtom)
    const items = useAtomValue(itemsWithNamesAtom)
    const fetchList = useSetAtom(fetchListAtom)
    const fetchProduct = useSetAtom(fetchProducts)


    useEffect(() => {
        fetchList()
        fetchProduct()
    }, [piid])

    return (
        <Container sx={{ padding: '2rem' }}>
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
        </Container >
    )
}