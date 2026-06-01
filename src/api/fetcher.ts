import { dispatchUnauthorized } from "@bbrighter/auth-module/auth";

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
	const resp = await fetch(input, init);
	if (resp.status === 401) dispatchUnauthorized();
	return resp;
};
