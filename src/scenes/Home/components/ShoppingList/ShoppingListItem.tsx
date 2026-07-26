import "react-swipeable-list/dist/styles.css";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {
	LeadingActions,
	SwipeAction,
	SwipeableListItem,
	TrailingActions,
} from "react-swipeable-list";
import ItemCheckBox from "./ItemCheckBox";
import ItemSecondaryAction from "./ItemSecondaryAction";

export type ShoppingListItemProps = {
	item: {
		checked: boolean;
		id: number;
		quantity?: number | null;
		productName?: string;
	};
	onCheck: (id: number) => Promise<void>;
	onDelete: (id: number) => Promise<void>;
	onUpdateQuantity: (id: number, quantity?: number) => Promise<void>;
};

export const ShoppingListItem = ({
	item,
	onCheck,
	onDelete,
	onUpdateQuantity,
}: ShoppingListItemProps) => {
	const checkButtonIcon = item.checked ? (
		<UnpublishedIcon />
	) : (
		<CheckCircleIcon />
	);

	const leadingActions = () => (
		<LeadingActions>
			<SwipeAction onClick={() => onCheck(item.id)}>
				<Button variant="contained" color="info" endIcon={checkButtonIcon} />
			</SwipeAction>
		</LeadingActions>
	);

	const trailingActions = () => (
		<TrailingActions>
			<SwipeAction onClick={() => onDelete(item.id)} destructive>
				<Button variant="contained" color="error" startIcon={<DeleteIcon />} />
			</SwipeAction>
		</TrailingActions>
	);

	const onIncrease = () => {
		const newQuantity = item.quantity ? item.quantity + 1 : 1;
		onUpdateQuantity(item.id, newQuantity);
	};
	const onDecrease = () => {
		const newQuantity =
			!item.quantity || item.quantity === 1 ? undefined : item.quantity - 1;
		onUpdateQuantity(item.id, newQuantity);
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
						item={item}
						onDecrease={onDecrease}
						onIncrease={onIncrease}
					/>
				}
			>
				<ItemCheckBox item={item} onCheck={onCheck} />
				<ListItemText
					primary={item.productName || "no name"}
					secondary={item.quantity}
				/>
			</ListItem>
		</SwipeableListItem>
	);
};
