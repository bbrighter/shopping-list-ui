import { useAuth } from "@bbrighter/auth-module/auth";

import { FullSizeLoader } from "./FullSizeLoader";

export const PermissionLoader = () => {
	const { isLoaded, token } = useAuth();

	return <FullSizeLoader open={!isLoaded && token !== ""} />;
};
