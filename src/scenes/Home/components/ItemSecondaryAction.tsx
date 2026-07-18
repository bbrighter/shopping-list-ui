import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

export default function ItemSecondaryAction(props: {
	item: { id: number; quantity?: number | null };
	onIncrease: () => void;
	onDecrease: () => void;
}) {
	const item = props.item;

	const disableDecrease =
		item?.quantity === undefined ||
		item?.quantity === null ||
		item?.quantity === 0;

	return (
		<ButtonGroup>
			<Button onClick={props.onIncrease} data-testid="increaseItemQuantity">
				+
			</Button>
			<Button
				onClick={props.onDecrease}
				disabled={disableDecrease}
				data-testid="decreaseItemQuantity"
			>
				-
			</Button>
		</ButtonGroup>
	);
}
