/* v8 ignore file -- @preserve */
import { HttpResponse, http } from "msw";

import type { authentication } from "../api/api";

export const userManagementHandlers = (url: string) => [
	http.get(`${url}/users`, () =>
		HttpResponse.json({
			users: [{ id: "123", name: "user 1" }],
		} as authentication.UserListResponse),
	),

	http.post(`${url}/users/:name`, () =>
		HttpResponse.json({
			id: "456",
		} as authentication.UUIDResponse),
	),

	http.delete(`${url}/users/:name`, () => HttpResponse.json({})),
];
