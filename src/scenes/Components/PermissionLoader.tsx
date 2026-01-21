import { useAuth } from '@bbrighter/auth-module/auth'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

export const PermissionLoader = () => {
    const { isLoaded, token } = useAuth()

    return (
        <Backdrop
            data-testid="permission-backdrop"
            open={!isLoaded && token != ''}
            sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        >
            <CircularProgress size={75} />
        </Backdrop>
    )
}
