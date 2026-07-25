import useMediaQuery from "@mui/material/useMediaQuery";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FinishListButton } from "./FinishListButton";

vi.mock("@mui/material/useMediaQuery", () => ({
	default: vi.fn(() => false),
}));

describe("FinishListButton component", () => {
	const onDelete = vi.fn();
	const onDeleteForce = vi.fn();
	const onDeleteAndMove = vi.fn();

	const renderButton = () => {
		render(
			<FinishListButton
				allItemsChecked={false}
				onDelete={onDelete}
				onDeleteAndMove={onDeleteAndMove}
				onForceDelete={onDeleteForce}
			/>,
		);
	};

	const openModal = async () => {
		const button = await screen.findByRole("button", {
			name: "Liste abschließen",
		});
		await userEvent.click(button);
		expect(await screen.findByRole("dialog")).toBeVisible();
	};

	const getCancelButton = () => {
		const button = screen.getByRole("button", { name: "Abbrechen" });
		expect(button).toBeVisible();
		return button;
	};

	const getMoveButton = () => {
		const button = screen.getByRole("button", { name: "Einträge verschieben" });
		expect(button).toBeVisible();
		return button;
	};

	const getForceDeleteButton = () => {
		const button = screen.getByRole("button", { name: "Einträge löschen" });
		expect(button).toBeVisible();
		return button;
	};

	beforeEach(() => vi.resetAllMocks());

	it("No modal if all items are checked", async () => {
		render(
			<FinishListButton
				allItemsChecked={true}
				onDelete={onDelete}
				onDeleteAndMove={onDeleteAndMove}
				onForceDelete={onDeleteForce}
			/>,
		);

		const button = await screen.findByRole("button", {
			name: "Liste abschließen",
		});
		await userEvent.click(button);

		expect(onDelete).toHaveBeenCalledOnce();
	});

	it("Renders all its content if unchecked items exist", async () => {
		renderButton();

		await openModal();

		expect(onDelete).not.toHaveBeenCalled();

		screen.getByText("Liste enthält noch Ungekauftes");
		getMoveButton();

		getCancelButton();
	});

	it("Open modal, cancel modal", async () => {
		renderButton();
		await openModal();

		const cancelButton = getCancelButton();
		await userEvent.click(cancelButton);

		expect(onDelete).not.toHaveBeenCalled();
		expect(onDeleteAndMove).not.toHaveBeenCalled();
		expect(onDeleteForce).not.toHaveBeenCalled();
		expect(await screen.findByRole("dialog")).not.toBeVisible();
	});

	it("Open modal, move entries", async () => {
		renderButton();
		await openModal();

		const moveButton = getMoveButton();
		await userEvent.click(moveButton);

		expect(onDelete).not.toHaveBeenCalled();
		expect(onDeleteAndMove).toHaveBeenCalled();
		expect(onDeleteForce).not.toHaveBeenCalled();
		expect(await screen.findByRole("dialog")).not.toBeVisible();
	});

	it("Open modal, force delete", async () => {
		renderButton();
		await openModal();

		const forceDeleteButton = getForceDeleteButton();
		await userEvent.click(forceDeleteButton);

		expect(onDelete).not.toHaveBeenCalled();
		expect(onDeleteAndMove).not.toHaveBeenCalled();
		expect(onDeleteForce).toHaveBeenCalled();
		expect(await screen.findByRole("dialog")).not.toBeVisible();
	});

	it("Buttons vertical on small screen", async () => {
		vi.mocked(useMediaQuery).mockReturnValue(true);

		renderButton();
		await openModal();

		const buttonGroup = screen.getByRole("group");
		expect(buttonGroup).toHaveClass("MuiButtonGroup-vertical");
	});

	it("Buttons horizontal on wide screen", async () => {
		renderButton();
		await openModal();

		const buttonGroup = screen.getByRole("group");
		expect(buttonGroup).toHaveClass("MuiButtonGroup-horizontal");
	});
});
