import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { ProductMenu } from './components';

export function ProductSelection() {

    return (
        <AppBar position='static'>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <ProductMenu />
                </Box>
            </Toolbar>
        </AppBar>

    )
}

