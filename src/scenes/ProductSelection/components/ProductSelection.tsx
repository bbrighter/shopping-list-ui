import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useActiveInstance, usePermissions } from '@bbrighter/auth-module';

export default function ProductSelection() {
    const instances = usePermissions()
    const selectedInstance = useActiveInstance()
    const color = (instanceId: string) => (instanceId == selectedInstance?.id ? 'primary.main' : undefined)

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
                    sx={{ color: color(i.id) }} />
            </MenuItem>
        ))}
        </>)
}