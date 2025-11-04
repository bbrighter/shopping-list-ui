import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { postLoginAtom } from '../../store/auth';

export default function Login() {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const login = useSetAtom(postLoginAtom)
    // const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const onLogin = async () => {
        setIsLoading(true)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const ok = await login({ password: password, userName: name })
        setIsLoading(false)
        // if (ok) {
        //     navigate('/')
        // }
    }

    return (<Container sx={{ padding: '2rem' }}>
        <TextField label="Name" value={name} onChange={onNameChange} />
        <TextField label="Password" type='Password' value={password} onChange={onPasswordChange} />
        <Button onClick={onLogin} loading={isLoading}>Login</Button>
    </Container>)
}