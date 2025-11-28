import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { productInstancesAtom, selectedProductInstanceAtom, type ProductInstance } from '../../../store/authStore';
import { useAtomValue } from 'jotai';

export default function ProductSelection() {
    const instances = useAtomValue(productInstancesAtom)
    const selectedInstance = useAtomValue(selectedProductInstanceAtom)
    const color = (inst: ProductInstance) => (inst.id == selectedInstance?.id ? 'primary.main' : undefined)

    const url = (id: string) => {
        const instance = instances.find(p => p.id == id)
        if (!instance) return
        const url = instance.url + '/' + instance.id
        return url
    }


    return (
        <> {instances.map(i => (
            <MenuItem component='a'
                key={i.id}
                href={url(i.id)}
            >
                <ListItemText
                    primary={i.productName}
                    secondary={i.id}
                    sx={{ color: color(i) }} />
            </MenuItem>
        ))}
        </>)
}