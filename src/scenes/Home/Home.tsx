import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import {
	deleteListAndMoveItemsAtom,
	deleteListAtom,
	deleteListForceAtom,
} from "../../store/actions.items.ts";
import { fetchMomentsAtom } from "../../store/actions.moments.ts";
import {
	FinishListButton,
	ItemInput,
	ShoppingList,
	useAllItemsChecked,
} from "./components";
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

	const onListDelete = useSetAtom(deleteListAtom);
	const onListDeleteForce = useSetAtom(deleteListForceAtom);
	const onListDeleteAndMove = useSetAtom(deleteListAndMoveItemsAtom);
	const allItemsChecked = useAllItemsChecked();

	return (
		<Container sx={{ padding: "2rem" }}>
			<Stack spacing={3}>
				<ProductManagement />
				<FinishListButton
					allItemsChecked={allItemsChecked}
					onDelete={onListDelete}
					onDeleteAndMove={onListDeleteAndMove}
					onForceDelete={onListDeleteForce}
				/>
				<ItemInput />
				<NoData />
				<ShoppingList />
			</Stack>
		</Container>
	);
}
