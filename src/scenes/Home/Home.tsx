import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { fetchMomentsAtom } from "../../store/actions.moments.ts";
import { FinishListButton, ItemInput, ShoppingList } from "./components";
import { NoData } from "./components/NoData.tsx";
import usePolling from "./hooks";
import { useItemGetter, useProductGetter } from "./hooks.ts";
import { ProductManagement } from "./Management/ProductManagement.tsx";

export default function Home() {
	const getMoments = useSetAtom(fetchMomentsAtom);
	useEffect(() => {
		getMoments();
	}, [getMoments]);
	usePolling(getMoments, 4000, []);
	useItemGetter();
	useProductGetter();

	return (
		<Container sx={{ padding: "2rem" }}>
			<Stack spacing={3}>
				<ProductManagement />
				<FinishListButton />
				<ItemInput />
				<NoData />
				<ShoppingList />
			</Stack>
		</Container>
	);
}
