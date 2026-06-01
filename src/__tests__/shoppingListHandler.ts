/* v8 ignore file -- @preserve */
import { HttpResponse, http } from "msw";

import type { shoppinglist } from "../api/api";

export const momentsHandler = {
	get: (overrides?: HttpResponse<shoppinglist.MomentsResponse>) =>
		http.get("/piid/:piid/moments", () => {
			if (!overrides) {
				return HttpResponse.json({
					itemsVersion: 0,
					productsVersion: 0,
				} satisfies shoppinglist.MomentsResponse);
			}
			return overrides;
		}),
};

export const listHandlers = {
	post: () =>
		http.post("/piid/:piid/list", () =>
			HttpResponse.json({
				id: 2,
				items: [
					{ id: 1, checked: false, productId: 1, quantity: 3 },
					{ id: 2, checked: true, productId: 2 },
				],
			} satisfies shoppinglist.ListResponse),
		),

	delete: () =>
		http.delete("/piid/:piid/list/:listId", ({ request }) => {
			const { force } = parseQuery(request);

			if (force === "true") {
				return HttpResponse.json({});
			}
			return HttpResponse.json({}, { status: 400 });
		}),
};

export const itemHandlers = {
	putItemByName: (result?: shoppinglist.ItemResponse) =>
		http.put("/piid/:piid/list/:listId/item", () =>
			HttpResponse.json(
				result ??
					({
						id: 3,
						checked: false,
						productId: 5,
					} satisfies shoppinglist.ItemResponse),
			),
		),
	postItemById: () =>
		http.post("/piid/:piid/list/:listId/item/:itemId", () =>
			HttpResponse.json({ id: 3 } satisfies shoppinglist.IdResponse),
		),
	patchCheck: () =>
		http.patch("/piid/:piid/item/:itemId/check", () => HttpResponse.json({})),
	delete: () =>
		http.delete("/piid/:piid/item/:itemId", () => HttpResponse.json({})),
	patch: () =>
		http.patch("/piid/:piid/item/:itemId", () => HttpResponse.json({})),
};

function parseQuery(request: Request) {
	return Object.fromEntries(new URL(request.url).searchParams.entries());
}

export const productHandlers = {
	list: () =>
		http.get("/piid/:piid/products", () =>
			HttpResponse.json({
				products: [
					{ id: 1, name: "prod1", archived: false },
					{ id: 2, name: "prod2", archived: false },
					{ id: 3, name: "prod3", archived: false },
					{ id: 4, name: "archived", archived: true },
				],
			} satisfies shoppinglist.ProductListResponse),
		),
	patch: () =>
		http.patch("/piid/:piid/products/:id", () => HttpResponse.json({})),
	delete: () =>
		http.delete("/piid/:piid/products/:id", () => HttpResponse.json({})),
};
