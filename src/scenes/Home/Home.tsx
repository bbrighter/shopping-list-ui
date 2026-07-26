import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
	deleteListAndMoveItemsAtom,
	deleteListAtom,
	deleteListForceAtom,
} from "../../store/actions.items.ts";
import { fetchMomentsAtom } from "../../store/actions.moments.ts";
import { selectors } from "../../store/index.ts";
import {
	FinishListButton,
	ItemInput,
	NoData,
	ShoppingList,
	useAllItemsChecked,
	useItemInput,
	useNoItemsFound,
	useShoppingListItem,
} from "./components";
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

	const itemInputs = useItemInput();

	const items = useAtomValue(selectors.items.withNames);
	const props = useShoppingListItem();

	const noItemsFound = useNoItemsFound();

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
				<ItemInput {...itemInputs} />
				<NoData show={noItemsFound} />
				<ShoppingList items={items} {...props} />
			</Stack>
		</Container>
	);
}
