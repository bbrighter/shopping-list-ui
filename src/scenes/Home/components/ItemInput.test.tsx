import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getDefaultStore } from "jotai";
import type { Store } from "jotai/vanilla/store";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "../../../__tests__/setupTest";
import { itemHandlers } from "../../../__tests__/shoppingListHandler";
import { api } from "../../../api/api";
import { piidAtom } from "../../../store/atoms.app";
import { itemsAtom } from "../../../store/items/atoms";
import { productsAtom } from "../../../store/products/atoms";
import { ItemInput } from "./ItemInput";

describe("Item input for shopping list", () => {
	let store: Store;

	beforeEach(() => {
		store = getDefaultStore();
		store.set(piidAtom, "123");
		store.set(itemsAtom, [{ id: 1, productId: 1, checked: true }]);
		store.set(productsAtom, [
			{ id: 1, name: "prod1", archived: false },
			{ id: 2, name: "prod2", archived: false },
			{ id: 3, name: "archived", archived: true },
		]);

		vi.resetAllMocks();
	});

	const spyPostItem = vi.spyOn(api, "PostItem");
	const spyPostItemByName = vi.spyOn(api, "PutItemByName");

	it("show correct content", async () => {
		render(<ItemInput />);

		const combobox = await screen.findByRole("combobox");
		await userEvent.click(combobox);

		expect(screen.getByText("prod2")).toBeInTheDocument();
		expect(screen.queryByText("prod1")).not.toBeInTheDocument();
		expect(screen.queryByText("archived")).not.toBeInTheDocument();
	});

	it("adding a new item", async () => {
		render(<ItemInput />);

		const combobox = await screen.findByRole("combobox");
		await userEvent.type(combobox, "new item");
		await userEvent.keyboard("{enter}");

		expect(spyPostItem).not.toHaveBeenCalled();
		expect(spyPostItemByName).toHaveBeenCalled();

		expect(store.get(itemsAtom)).toHaveLength(2);
		expect(store.get(productsAtom)).toHaveLength(4);
	});

	it("adding an existing item", async () => {
		render(<ItemInput />);

		const combobox = await screen.findByRole("combobox");
		await userEvent.click(combobox);

		const product2 = screen.getByText("prod2");
		await userEvent.click(product2);

		expect(spyPostItem).toHaveBeenCalled();
		expect(spyPostItemByName).not.toHaveBeenCalled();

		expect(store.get(itemsAtom)).toHaveLength(2);
		expect(store.get(productsAtom)).toHaveLength(3);
	});

	it("adding an existing item by enter", async () => {
		server.use(
			itemHandlers.putItemByName({ id: 3, productId: 2, checked: false }),
		);
		render(<ItemInput />);

		const combobox = await screen.findByRole("combobox");
		await userEvent.type(combobox, "prod2");
		await userEvent.keyboard("{enter}");

		expect(spyPostItem).not.toHaveBeenCalled();
		expect(spyPostItemByName).toHaveBeenCalled();

		expect(store.get(itemsAtom)).toHaveLength(2);
		expect(store.get(productsAtom)).toHaveLength(3);
	});

	it("adding an existing, but archived item", async () => {
		server.use(
			itemHandlers.putItemByName({ id: 3, productId: 2, checked: false }),
		);
		render(<ItemInput />);

		const combobox = await screen.findByRole("combobox");
		await userEvent.type(combobox, "archived");
		await userEvent.keyboard("{enter}");

		expect(spyPostItem).not.toHaveBeenCalled();
		expect(spyPostItemByName).toHaveBeenCalled();

		expect(store.get(itemsAtom)).toHaveLength(2);
		expect(store.get(productsAtom)).toHaveLength(3);
	});
});
