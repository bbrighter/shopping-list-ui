import { CustomAppBar } from "@bbrighter/auth-module/app-bar";
import {
	AuthProvider,
	useAuth,
	useHandleUnauthorized,
} from "@bbrighter/auth-module/auth";
import { Login } from "@bbrighter/auth-module/login";
import { UserManagementProvider } from "@bbrighter/auth-module/users";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { Redirect, Route, Switch, useLocation } from "wouter";

import { PermissionLoader } from "./scenes/Components";
import Home from "./scenes/Home/Home";
import { ProductManagementButton } from "./scenes/Home/Management";
import { useAuthStateAdapter, useUserManagementAdapter } from "./store/adapter";
import { authApiAtom, piidAtom } from "./store/atoms.app";

export default function App() {
	const [_, navigate] = useLocation();

	const authStateAdpater = useAuthStateAdapter();
	const userManagementAdapter = useUserManagementAdapter();

	if (!authStateAdpater || !userManagementAdapter) return;

	return (
		<AuthProvider adapter={authStateAdpater}>
			<Toaster />
			<UserManagementProvider adapter={userManagementAdapter}>
				<AppEffects navigate={navigate} />
				<PermissionLoader />
				<CustomAppBar>
					<ProductManagementButton />
				</CustomAppBar>
				<Switch>
					<Route path="/login" component={Login} />
					<Route path="/:piid" component={Home} />
					<Route>
						<Redirect to="/login" />
					</Route>
				</Switch>
			</UserManagementProvider>
		</AuthProvider>
	);
}

const AppEffects = ({ navigate }: { navigate: (_: string) => void }) => {
	useSetPermissions();
	usePiidLocation();
	useHandleUnauthorized(navigate);
	return null;
};

const useSetPermissions = () => {
	const { setPermissions, token, isLoaded } = useAuth();
	const api = useAtomValue(authApiAtom);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Must set permissions if token is changed>
	useEffect(() => {
		if (isLoaded) return;
		setPermissions();
	}, [token, api, isLoaded, setPermissions]);
};

const usePiidLocation = () => {
	const { piid } = useAuth();
	const setPiid = useSetAtom(piidAtom);
	const [, navigate] = useLocation();
	const api = useAtomValue(authApiAtom);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Must navigate if API is available (true???)>
	useEffect(() => {
		if (piid) {
			setPiid(piid);
			navigate(`/${piid}`, {
				replace: true,
			});
		}
	}, [piid, api, navigate, setPiid]);
};
