import { Redirect, Route, Switch, useLocation } from 'wouter'
import Home from './scenes/Home/Home'
import { useEffect } from 'react'
import { ProductSelection } from './scenes/ProductSelection/index.tsx'
import { useGetPermissions, useToken, useHandleUnauthorized, Login, usePiid } from '@bbrighter/auth-module'



function App() {
    const [_, navigate] = useLocation()
    useSetPermissions()
    usePiidLocation()
    useHandleUnauthorized(navigate)

    return (
        <>
            <ProductSelection />
            <Switch>
                <Route path={'/login'} component={Login} />
                <Route path={'/:piid'} component={Home} />
                <Route>
                    <Redirect to='/login' />
                </Route>
            </Switch>
        </>
    )
}

export default App


const useSetPermissions = () => {
    const getPermissions = useGetPermissions()

    const token = useToken()
    useEffect(() => {
        getPermissions()
    }, [token])
}


const usePiidLocation = () => {
    const piid = usePiid()
    const [, navigate] = useLocation()

    useEffect(() => {
        if (piid) {
            navigate(`/${piid}`, {
                replace: true,
            })
        }
    }, [piid])
}


