import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { fetchListAtom, listAtom } from '../../store/list'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { piidAtom } from '../../store/auth'


export default function Home() {
    const getList = useSetAtom(fetchListAtom)
    const piid = useAtomValue(piidAtom)
    const list = useAtomValue(listAtom)
    useEffect(() => {
        getList()
    }, [piid])

    return <List>
        {list.map(l => (
            <ListItem key={l.id}>
                <ListItemText primary={l.productName} secondary={l.quantity} />
            </ListItem>
        ))}
    </List>
}