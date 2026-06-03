import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

import { server } from "./__tests__/setupTest";
import App from "./App";
import type { shoppinglist } from "./api/api";

describe("app", () => {
	const renderApp = (path: string) => {
		const { hook, searchHook } = memoryLocation({ path: path, static: true });
		render(
			<Router hook={hook} searchHook={searchHook}>
				<App />
			</Router>,
		);
	};

	it("spinner while getting permissions", async () => {
		server.use(
			http.get("/piid/:piid/moments", async () => {
				await delay(500);
				return HttpResponse.json({
					itemsVersion: 0,
					productsVersion: 0,
				} satisfies shoppinglist.MomentsResponse);
			}),
		);

		renderApp("/68a06340-c811-4820-bb18-fbe750f24f4a");

		const backdrop = screen.getAllByTestId("loader-backdrop")[0];
		expect(backdrop).toBeInTheDocument();

		await waitFor(() => expect(backdrop).toBeVisible());
		await waitFor(() => expect(backdrop).not.toBeVisible());
	});

	it("product management opens", async () => {
		renderApp("/68a06340-c811-4820-bb18-fbe750f24f4a");

		const managementButton = await screen.findByTestId("management-button");
		expect(managementButton).toBeInTheDocument();

		await userEvent.click(managementButton);

		const modal = screen.getByRole("dialog");
		expect(modal).toBeVisible();
	});
});
