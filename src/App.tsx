import { Route, Switch, useLocation } from 'wouter'
import Login from './scenes/Login/Login'
import Home from './scenes/Home/Home'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { getPermissionsAtom, piidAtom, tokenAtom } from './store/authStore/index.ts'
import { ProductSelection } from './scenes/ProductSelection/index.tsx'
import { AUTH_EVENT_NAME } from './api/fetcher.ts'



function App() {
    useSetPermissions()
    usePiidLocation()
    useHandleUnauthorized()

    return (
        <>
            <ProductSelection />
            <Switch>
                <Route path={'/login'} component={Login} />
                <Route path={'/:piid'} component={Home} />
                <Route>404, Not Found!</Route>
            </Switch>
        </>
    )
}

export default App


const useSetPermissions = () => {
    const piid = useAtomValue(piidAtom)
    const token = useAtomValue(tokenAtom)
    const getPermissions = useSetAtom(getPermissionsAtom)

    useEffect(() => {
        getPermissions()
    }, [piid, token])
}


const usePiidLocation = () => {
    const piid = useAtomValue(piidAtom)

    const [, navigate] = useLocation();
    useEffect(() => {
        if (piid) {
            navigate(`/${piid}`, {
                replace: true,
            })
        }
    }, [piid])
}


const useHandleUnauthorized = () => {
    const [, navigate] = useLocation();

    useEffect(() => {
        const onUnauthorized = (e: Event) => {
            const path = (e as CustomEvent).detail as string

            if (!path) return

            if (path.includes('login')) return

            const guidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
            const match = path.match(guidRegex)
            const redirectPath = match ? `/login?piid=${match}` : '/login'
            navigate(redirectPath)
        }

        window.addEventListener(AUTH_EVENT_NAME, onUnauthorized)
        return () => window.removeEventListener(AUTH_EVENT_NAME, onUnauthorized)
    }, [])
}
