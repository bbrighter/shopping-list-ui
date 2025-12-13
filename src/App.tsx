import { Redirect, Route, Switch, useLocation } from 'wouter'
import Home from './scenes/Home/Home'
import { useEffect } from 'react'
import { ProductSelection } from './scenes/ProductSelection/index.tsx'
import { useGetPermissions, useToken, useHandleUnauthorized, Login, usePiid, AuthProvider, UserManagementProvider } from '@bbrighter/auth-module'
import { useAuthStateAdapter, useUserManagementAdapter } from './store/adapter.ts'
import { useAtomValue, useSetAtom } from 'jotai'
import { authApiAtom, piidAtom } from './store/atoms.ts'


function App() {
    const [_, navigate] = useLocation()

    const authStateAdpater = useAuthStateAdapter()
    const userManagementAdapter = useUserManagementAdapter()

    if (!authStateAdpater || !userManagementAdapter) return

    return (
        <AuthProvider adapter={authStateAdpater}>
            <UserManagementProvider adapter={userManagementAdapter}>
                <AppEffects navigate={navigate} />
                <ProductSelection />
                <Switch>
                    <Route path={'/login'} component={Login} />
                    <Route path={'/:piid'} component={Home} />
                    <Route>
                        <Redirect to='/login' />
                    </Route>
                </Switch>
            </UserManagementProvider>
        </AuthProvider>
    )
}

export default App

const AppEffects = ({ navigate }: { navigate: (_: string) => void }) => {
    useSetPermissions()
    usePiidLocation()
    useHandleUnauthorized(navigate)
    return null
}

const useSetPermissions = () => {
    const getPermissions = useGetPermissions()
    const api = useAtomValue(authApiAtom)

    const token = useToken()
    useEffect(() => {
        getPermissions()
    }, [token, api])
}


const usePiidLocation = () => {
    const piid = usePiid()
    const setPiid = useSetAtom(piidAtom)
    const api = useAtomValue(authApiAtom)
    const [, navigate] = useLocation()

    useEffect(() => {
        if (piid) {
            setPiid(piid)
            navigate(`/${piid}`, {
                replace: true,
            })
        }
    }, [piid, api])
}


