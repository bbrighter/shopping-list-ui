import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

import {
	deleteListAndMoveItemsAtom,
	deleteListAtom,
	deleteListForceAtom,
} from "../../../store";
import { itemsAtom } from "../../../store/items/atoms";
import { FullSizeLoader } from "../../Components";

export function FinishListButton() {
	const [loading, setLoading] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const deleteList = useSetAtom(deleteListAtom);
	const forceDeleteList = useSetAtom(deleteListForceAtom);
	const deleteListAndMoveItems = useSetAtom(deleteListAndMoveItemsAtom);
	const canBeClosed = useListCanBeClosed();

	const onClick = async () => {
		setLoading(true);
		if (canBeClosed) {
			await deleteList();
		} else {
			setShowConfirmation(true);
		}
		setLoading(false);
	};

	const onConfirmDeletion = async () => {
		setLoading(true);
		await forceDeleteList();
		setLoading(false);
		setShowConfirmation(false);
	};

	const onMoveItemsAndDelete = async () => {
		setLoading(true);
		await deleteListAndMoveItems();
		setLoading(false);
		setShowConfirmation(false);
	};

	return (
		<>
			<FullSizeLoader open={loading} />
			<Dialog open={showConfirmation}>
				<DialogTitle>Liste enthält noch Ungekauftes</DialogTitle>
				<Box sx={{ padding: "2rem" }}>
					<Typography>
						Nicht alle Gegenstände sind abgehakt. Liste löschen und Gegenstände
						entfernen?
					</Typography>
					<ButtonGroup
						variant="contained"
						sx={{ pt: "1rem" }}
						color="inherit"
						disabled={loading}
					>
						<Button color="primary" onClick={onMoveItemsAndDelete}>
							Einträge verschieben
						</Button>
						<Button color="error" onClick={onConfirmDeletion}>
							Dennoch löschen
						</Button>
						<Button color="inherit" onClick={() => setShowConfirmation(false)}>
							Behalten
						</Button>
					</ButtonGroup>
				</Box>
			</Dialog>
			<Button loading={loading} onClick={onClick}>
				Liste abschließen
			</Button>
		</>
	);
}

const useListCanBeClosed = (): boolean => {
	const items = useAtomValue(itemsAtom);
	return items.every((i) => i.checked);
};
