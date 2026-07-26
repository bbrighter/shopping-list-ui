import { describe, expect, it } from "vitest";
import { getProductsNotAlreadyInUse } from "./hooks";

describe("getProductsNotAlreadyInUse", () => {
	it("Shows all products when no items exist", () => {
		const products = [{ id: 1, name: "prod1", archived: false }];

		const result = getProductsNotAlreadyInUse(products, []);

		expect(result).toHaveLength(1);
		expect(result[0]).toStrictEqual({ id: 1, name: "prod1", archived: false });
	});

	it("Shows only products for which items do not exist", () => {
		const products = [{ id: 1, name: "prod1", archived: false }];
		const items = [{ id: 1, productId: 1, checked: true }];

		const result = getProductsNotAlreadyInUse(products, items);

		expect(result).toHaveLength(0);
	});

	it("Sorts alphabetically", () => {
		const products = [
			{ id: 10, name: "a", archived: false },
			{ id: 8, name: "b", archived: false },
		];

		const result = getProductsNotAlreadyInUse(products, []);

		expect(result).toHaveLength(2);
		expect(result[0].name).toBe("a");
		expect(result[1].name).toBe("b");
	});
});
