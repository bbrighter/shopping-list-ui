import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ItemsWithProductNames } from "../../../../store/selectors";
import { ShoppingList } from "./ShoppingList";

describe("Shopping list component", () => {
	const onCheck = vi.fn();
	const onDelete = vi.fn();
	const onUpdateQuantity = vi.fn();

	const items = [
		{ id: 1, checked: false, productId: 1, productName: "prod1" },
		{ id: 2, checked: true, productId: 2, productName: "prod2" },
	] satisfies ItemsWithProductNames;

	const renderList = (items: ItemsWithProductNames) => {
		render(
			<ShoppingList
				items={items}
				onCheck={onCheck}
				onDelete={onDelete}
				onUpdateQuantity={onUpdateQuantity}
			/>,
		);
	};

	const getItemRow = (productName: string) =>
		screen.getByText(productName).closest("li") as HTMLElement;

	it("List renders", async () => {
		renderList(items);

		const prod1 = getItemRow("prod1");
		const prod2 = getItemRow("prod2");
		expect(screen.queryAllByTestId("increaseItemQuantity")).toHaveLength(2);
		expect(screen.queryAllByTestId("decreaseItemQuantity")).toHaveLength(2);
		expect(screen.queryAllByRole("checkbox")).toHaveLength(2);

		expect(within(prod1).getByRole("checkbox")).not.toBeChecked();
		expect(within(prod2).getByRole("checkbox")).toBeChecked();
	});

	it("Check unchecked item", async () => {
		renderList([{ id: 1, checked: false, productId: 1, productName: "prod1" }]);

		const prod1 = getItemRow("prod1");
		const checkbox = within(prod1).getByRole("checkbox");
		expect(checkbox).not.toBeChecked();
		await userEvent.click(checkbox);

		expect(onCheck).toHaveBeenCalledExactlyOnceWith(1);
	});

	it("Uncheck checked item", async () => {
		renderList([{ id: 1, checked: true, productId: 1, productName: "prod1" }]);

		const prod1 = getItemRow("prod1");
		const checkbox = within(prod1).getByRole("checkbox");
		expect(checkbox).toBeChecked();
		await userEvent.click(checkbox);

		expect(onCheck).toHaveBeenCalledExactlyOnceWith(1);
	});

	it("Increase and decrease quantity", async () => {
		renderList([
			{
				id: 1,
				checked: false,
				productId: 1,
				productName: "prod1",
				quantity: 5,
			},
		]);

		const prod1 = getItemRow("prod1");
		expect(prod1).toHaveTextContent("5");
		const increaseButton = within(prod1).getByTestId("increaseItemQuantity");
		const decreaseButton = within(prod1).getByTestId("decreaseItemQuantity");

		await userEvent.click(increaseButton);
		expect(onUpdateQuantity).toHaveBeenCalledExactlyOnceWith(1, 6);

		await userEvent.click(decreaseButton);
		expect(onUpdateQuantity).toHaveBeenLastCalledWith(1, 4); // 4 is correct, because the state doesn't update in between
	});

	it.each([
		[0, true],
		[undefined, true],
		[null, true],
		[5, false],
	])(
		"Decrease quantity button enabled/disabled when quantity is %s",
		async (quantity, shouldBeDisabled) => {
			const testItem = {
				id: 1,
				checked: false,
				productId: 1,
				productName: "prod1",
				...(quantity !== undefined && { quantity }),
			};
			renderList([testItem]);

			const decreaseButton = within(getItemRow("prod1")).getByTestId(
				"decreaseItemQuantity",
			);
			if (shouldBeDisabled === true) {
				expect(decreaseButton).toBeDisabled();
			} else {
				expect(decreaseButton).not.toBeDisabled();
			}
		},
	);
});
