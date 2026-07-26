import { SwipeableList, Type } from "react-swipeable-list";
import type { ItemsWithProductNames } from "../../../../store/selectors";
import {
	ShoppingListItem,
	type ShoppingListItemProps,
} from "./ShoppingListItem";

type ShoppingListProps = {
	items: ItemsWithProductNames;
} & Omit<ShoppingListItemProps, "item">;

export const ShoppingList = ({ items, ...itemProps }: ShoppingListProps) => {
	return (
		<SwipeableList type={Type.ANDROID}>
			{items.map((it) => (
				<ShoppingListItem key={it.id} item={it} {...itemProps} />
			))}
		</SwipeableList>
	);
};
