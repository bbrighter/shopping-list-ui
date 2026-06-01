import type { AuthStateAdapter } from "@bbrighter/auth-module/auth";
import type { UserStateAdapter } from "@bbrighter/auth-module/users";
import { useAtom, useAtomValue } from "jotai";
import { useLocation as useLocationWouter } from "wouter";

import {
	authApiAtom,
	piidAtom,
	productInstancesAtom,
	productInstancesLoadedAtom,
	productKeyAtom,
	tokenAtom,
	userApiAtom,
	userNameAtom,
	usersAtom,
} from "./atoms.app";

export const useAuthStateAdapter = (): AuthStateAdapter => {
	const [token, setToken] = useAtom(tokenAtom);
	const useToken = () => ({ token, setToken });
	const authApi = useAtomValue(authApiAtom);
	const useAuthApi = () => authApi;
	const [userName, setUserName] = useAtom(userNameAtom);
	const useUserName = () => ({ userName, setUserName });
	const [instances, setInstances] = useAtom(productInstancesAtom);
	const [isLoaded, setIsLoaded] = useAtom(productInstancesLoadedAtom);
	const useProductInstances = () => ({
		instances,
		setInstances,
		isLoaded,
		setIsLoaded,
	});
	const productKey = useAtomValue(productKeyAtom);
	const useProductKey = () => productKey;
	const [location, navigate] = useLocationWouter();
	const useLocation = () => ({ location, navigate });

	return {
		useToken,
		useAuthApi,
		useUserName,
		useProductInstances,
		useProductKey,
		useLocation,
	};
};

export const useUserManagementAdapter = (): UserStateAdapter => {
	const [users, setUsers] = useAtom(usersAtom);
	const useUsers = () => ({ users, setUsers });
	const api = useAtomValue(userApiAtom);
	const useApi = () => api;
	const piid = useAtomValue(piidAtom);
	const usePiid = () => piid;

	return { useUsers, useApi, usePiid };
};
