import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type createStore, getDefaultStore } from "jotai";
import { beforeEach, describe, expect, it } from "vitest";

import { atoms } from "../../../store";
import { piidAtom } from "../../../store/atoms.app";
import { ProductManagement } from "./ProductManagement";

const getToggle = () => {
	const modal = screen.getByRole("dialog");
	return within(modal).getByLabelText("Archivierte anzeigen");
};

const getListItem = (product: string) => {
	const archivedListItem = screen.getByText(product).closest("li");
	expect(archivedListItem).toBeDefined();
	return archivedListItem as HTMLElement;
};

describe("Product management modal", () => {
	let store: ReturnType<typeof createStore>;

	beforeEach(() => {
		store = getDefaultStore();
		store.set(atoms.products.isManagementOpen, true);
		store.set(piidAtom, "1234");
	});

	it("renders", async () => {
		render(<ProductManagement />);

		const modal = await screen.findByRole("dialog");
		expect(modal).toBeVisible();
		expect(modal).toHaveTextContent("Verwaltung");
		const toggle = getToggle();
		expect(toggle).toBeInTheDocument();

		const listItems = screen.queryAllByRole("listitem");
		expect(listItems).toHaveLength(3);
	});

	it("toggle works", async () => {
		render(<ProductManagement />);

		const toggle = await waitFor(() => getToggle());
		await userEvent.click(toggle);

		const listItems = screen.queryAllByRole("listitem");
		expect(listItems).toHaveLength(4);

		const archivedListItem = getListItem("archived");
		expect(within(archivedListItem).getByTestId("UnarchiveIcon")).toBeDefined();
	});

	it("archiving works", async () => {
		render(<ProductManagement />);

		const prod1ListItem = await waitFor(() => getListItem("prod1"));
		const archiveButton = within(prod1ListItem).getByTestId("ArchiveIcon");
		expect(archiveButton).toBeDefined();

		await userEvent.click(archiveButton);
		expect(screen.queryByText("prod1")).not.toBeInTheDocument();
	});
});
