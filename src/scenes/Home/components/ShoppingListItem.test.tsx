import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ItemSecondaryAction from "./ItemSecondaryAction";

describe("ItemSecondaryAction component", () => {
	const findIncreaseButton = async () =>
		await screen.findByTestId("increaseItemQuantity");
	const findDecreaseButton = async () =>
		await screen.findByTestId("decreaseItemQuantity");

	const onIncrease = vi.fn();
	const onDecrease = vi.fn();

	it("Renders and clickable", async () => {
		render(
			ItemSecondaryAction({
				item: { id: 1, quantity: 2 },
				onIncrease: onIncrease,
				onDecrease: onDecrease,
			}),
		);

		const increase = await findIncreaseButton();
		expect(increase).toBeInTheDocument();
		expect(increase).toBeEnabled();
		const decrease = await findDecreaseButton();
		expect(decrease).toBeInTheDocument();
		expect(decrease).toBeEnabled();

		await userEvent.click(increase);
		expect(onIncrease).toHaveBeenCalled();

		await userEvent.click(decrease);
		expect(onDecrease).toHaveBeenCalled();
	});

	it("Disabled, if quantity is 0", async () => {
		render(
			ItemSecondaryAction({
				item: { id: 1, quantity: 0 },
				onIncrease: onIncrease,
				onDecrease: onDecrease,
			}),
		);

		const decrease = await findDecreaseButton();
		expect(decrease).toBeDisabled();
	});

	it("Disabled, if quantity is undefined", async () => {
		render(
			ItemSecondaryAction({
				item: { id: 1 },
				onIncrease: onIncrease,
				onDecrease: onDecrease,
			}),
		);

		const decrease = await findDecreaseButton();
		expect(decrease).toBeDisabled();
	});

	it("Disabled, if quantity is null", async () => {
		render(
			ItemSecondaryAction({
				item: { id: 1, quantity: null },
				onIncrease: onIncrease,
				onDecrease: onDecrease,
			}),
		);

		const decrease = await findDecreaseButton();
		expect(decrease).toBeDisabled();
	});
});
