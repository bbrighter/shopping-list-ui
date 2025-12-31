import { CustomAppBar } from '@bbrighter/auth-module/app-bar'
import { AuthProvider, useAuth, useHandleUnauthorized } from '@bbrighter/auth-module/auth'
import { Login } from '@bbrighter/auth-module/login'
import { UserManagementProvider } from '@bbrighter/auth-module/users'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { Redirect, Route, Switch, useLocation } from 'wouter'

import Home from './scenes/Home/Home'
import { authApiAtom, piidAtom, useAuthStateAdapter, useUserManagementAdapter } from './store'

export default function App() {
    const [_, navigate] = useLocation()

    const authStateAdpater = useAuthStateAdapter()
    const userManagementAdapter = useUserManagementAdapter()

    if (!authStateAdpater || !userManagementAdapter) return

    return (
        <AuthProvider adapter={authStateAdpater}>
            <UserManagementProvider adapter={userManagementAdapter}>
                <AppEffects navigate={navigate} />
                <CustomAppBar />
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/:piid" component={Home} />
                    <Route>
                        <Redirect to="/login" />
                    </Route>
                </Switch>
            </UserManagementProvider>
        </AuthProvider>
    )
}

const AppEffects = ({ navigate }: { navigate: (_: string) => void }) => {
    useSetPermissions()
    usePiidLocation()
    useHandleUnauthorized(navigate)
    return null
}

const useSetPermissions = () => {
    const { setPermissions, token } = useAuth()
    const api = useAtomValue(authApiAtom)

    useEffect(() => {
        setPermissions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, api])
}

const usePiidLocation = () => {
    const { piid } = useAuth()
    const setPiid = useSetAtom(piidAtom)
    const [, navigate] = useLocation()
    const api = useAtomValue(authApiAtom)

    useEffect(() => {
        if (piid) {
            setPiid(piid)
            navigate(`/${piid}`, {
                replace: true,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [piid, api])
}
