import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Item } from "../../../../store/items/types";
import type { Product } from "../../../../store/products/types";
import { ItemInput } from "./ItemInput";

vi.mock("sonner", () => ({
	toast: {
		info: vi.fn(),
	},
}));

describe("Item input for shopping list", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	const addItemById = vi.fn();
	const addItemByName = vi.fn();

	const renderItemInput = (
		products: Array<Product>,
		items: Array<Item & { productName?: string }>,
	) => {
		render(
			<ItemInput
				products={products}
				items={items}
				addItemById={addItemById}
				addItemByName={addItemByName}
			/>,
		);
	};

	const products = [
		{ id: 1, name: "prod1", archived: false },
		{ id: 2, name: "prod2", archived: false },
	] satisfies Array<Product>;

	it("show correct content", async () => {
		renderItemInput(products, []);

		const combobox = await screen.findByRole("combobox");
		await userEvent.click(combobox);

		expect(screen.getByText("prod1")).toBeInTheDocument();
		expect(screen.queryByText("prod2")).toBeInTheDocument();
	});

	it("adding an item for a new product", async () => {
		renderItemInput(products, []);

		const combobox = await screen.findByRole("combobox");
		await userEvent.type(combobox, "new item");
		await userEvent.keyboard("{enter}");

		expect(addItemById).not.toHaveBeenCalled();
		expect(addItemByName).toHaveBeenCalledExactlyOnceWith({ name: "new item" });
	});

	it("adding an item for an existing product", async () => {
		renderItemInput(products, []);

		const combobox = await screen.findByRole("combobox");
		await userEvent.click(combobox);

		const product2 = screen.getByText("prod2");
		await userEvent.click(product2);

		expect(addItemById).toHaveBeenCalledExactlyOnceWith({ id: 2 });
		expect(addItemByName).not.toHaveBeenCalled();
	});

	it("adding an item which already is in the list is not possible", async () => {
		renderItemInput(products, [
			{ id: 1, productId: 1, checked: false, productName: "prod1" },
		]);

		const combobox = await screen.findByRole("combobox");
		await userEvent.click(combobox);

		await userEvent.type(combobox, "prod1");
		await userEvent.keyboard("{enter}");

		expect(toast.info).toHaveBeenCalled();
		expect(addItemById).not.toHaveBeenCalled();
		expect(addItemByName).not.toHaveBeenCalled();
	});
});
