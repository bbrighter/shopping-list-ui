import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { piidAtom, postLoginAtom } from '../../store/auth';
import { useLocation } from 'wouter';

export default function Login() {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const login = useSetAtom(postLoginAtom)
    const piid = useAtomValue(piidAtom)
    const [, navigate] = useLocation()
    const [loginState, setLoginState] = useState<'default' | 'error' | 'loading' | 'success'>('default')

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const onLogin = async () => {
        setLoginState('loading')
        const ok = await login({ password: password, userName: name })
        if (ok) {
            setLoginState('success')
        } else {
            setLoginState('error')
        }
    }

    useEffect(() => {
        if (loginState == 'success' && piid) {
            navigate(`/${piid}`)
        }
    }, [piid, loginState])

    return (<Container sx={{ padding: '2rem', display: 'flex', flexDirection: 'column', rowGap: '1rem', width: '20rem' }}>
        <TextField label="Name" value={name} onChange={onNameChange} />
        <TextField label="Password" type='password' value={password} onChange={onPasswordChange} />
        <Button
            variant='contained'
            onClick={onLogin}
            loading={loginState == 'loading'}
            color={loginState == 'error' ? 'error' : 'primary'}
        >Login</Button>
    </Container>)
}