import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NoData } from "./NoData";

describe("No Data component", () => {
	it("Shown", async () => {
		render(<NoData show={true} />);

		const img = screen.getByRole("img");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute("src");
		expect(img.getAttribute("src")).toContain("empty-cart.svg");
	});

	it("Not shown", async () => {
		const { container } = render(<NoData show={false} />);

		expect(container).toBeEmptyDOMElement();
	});
});
