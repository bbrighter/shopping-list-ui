import { Route, Switch, useLocation } from 'wouter'
import Login from './scenes/Login/Login'
import Home from './scenes/Home/Home'
import { useAtomValue, useSetAtom } from 'jotai'
import { getPermissionsAtom, piidAtom, tokenAtom } from './store/auth'
import { useEffect } from 'react'


function App() {
    useSetPermissions()
    usePiidLocation()

    return (
        <Switch>
            <Route path={'/login'} component={Login} />
            <Route path={'/:piid'} component={Home} />
            <Route>404, Not Found!</Route>
        </Switch>
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

