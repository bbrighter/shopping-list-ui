import { Route, Switch } from 'wouter'
import Login from './scenes/Login/Login'
import Home from './scenes/Home/Home'
import { useSetAtom } from 'jotai'
import { getPermissionsAtom } from './store/auth'
import { useEffect } from 'react'


function App() {
    const getPermissions = useSetAtom(getPermissionsAtom)
    useEffect(() => {
        getPermissions()
    }, [getPermissions])

    return (
        <Switch>
            <Route path={'/login'} component={Login} />
            <Route path={'/'} component={Home} />
            <Route>404, Not Found!</Route>
        </Switch>
    )
}

export default App


