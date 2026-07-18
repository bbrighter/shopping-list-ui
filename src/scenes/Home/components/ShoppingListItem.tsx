import "react-swipeable-list/dist/styles.css";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useSetAtom } from "jotai";
import {
	LeadingActions,
	SwipeAction,
	SwipeableListItem,
	TrailingActions,
} from "react-swipeable-list";

import {
	changeItemQuantityAtom,
	checkItemAtom,
	deleteItemAtom,
} from "../../../store";
import ItemCheckBox from "./ItemCheckBox";
import ItemSecondaryAction from "./ItemSecondaryAction";

export const ShoppingListItem = ({
	it,
}: {
	it: {
		checked: boolean;
		id: number;
		quantity?: number | null;
		productName?: string;
	};
}) => {
	const check = useSetAtom(checkItemAtom);
	const deleteItem = useSetAtom(deleteItemAtom);
	const updateItem = useSetAtom(changeItemQuantityAtom);

	const checkButtonIcon = it.checked ? (
		<UnpublishedIcon />
	) : (
		<CheckCircleIcon />
	);

	const leadingActions = () => (
		<LeadingActions>
			<SwipeAction onClick={() => check(it.id)}>
				<Button variant="contained" color="info" endIcon={checkButtonIcon} />
			</SwipeAction>
		</LeadingActions>
	);

	const trailingActions = () => (
		<TrailingActions>
			<SwipeAction onClick={() => deleteItem(it.id)} destructive>
				<Button variant="contained" color="error" startIcon={<DeleteIcon />} />
			</SwipeAction>
		</TrailingActions>
	);

	const onIncrease = () => {
		const newQuantity = it.quantity ? it.quantity + 1 : 1;
		updateItem(it.id, newQuantity);
	};
	const onDecrease = () => {
		const newQuantity =
			!it.quantity || it.quantity === 1 ? undefined : it.quantity - 1;
		updateItem(it.id, newQuantity);
	};

	return (
		<SwipeableListItem
			threshold={0.5}
			leadingActions={leadingActions()}
			trailingActions={trailingActions()}
		>
			<ListItem
				secondaryAction={
					<ItemSecondaryAction
						item={it}
						onDecrease={onDecrease}
						onIncrease={onIncrease}
					/>
				}
			>
				<ItemCheckBox item={it} />
				<ListItemText
					primary={it.productName || "no name"}
					secondary={it.quantity}
				/>
			</ListItem>
		</SwipeableListItem>
	);
};
