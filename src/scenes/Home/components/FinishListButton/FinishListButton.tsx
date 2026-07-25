import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { FullSizeLoader } from "../../../Components";

type FinishListButtonProps = {
	allItemsChecked: boolean;
	onDelete: () => Promise<boolean>;
	onForceDelete: () => Promise<void>;
	onDeleteAndMove: () => Promise<void>;
};

export function FinishListButton({
	allItemsChecked,
	onDelete,
	onForceDelete,
	onDeleteAndMove,
}: FinishListButtonProps) {
	const [loading, setLoading] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const onClick = async () => {
		setLoading(true);
		if (allItemsChecked) {
			await onDelete();
		} else {
			setShowConfirmation(true);
		}
		setLoading(false);
	};

	const onConfirmDeletion = async () => {
		setLoading(true);
		await onForceDelete();
		setLoading(false);
		setShowConfirmation(false);
	};

	const onMoveItemsAndDelete = async () => {
		setLoading(true);
		await onDeleteAndMove();
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
						{isMobile ? "isMobile" : "not mobile"}
						Nicht alle Gegenstände sind abgehakt. Wie sollen wir weitermachen?
					</Typography>
					<ButtonGroup
						variant="contained"
						sx={{ pt: "1rem" }}
						color="inherit"
						disabled={loading}
						orientation={isMobile ? "vertical" : "horizontal"}
					>
						<Button color="primary" onClick={onMoveItemsAndDelete}>
							Einträge verschieben
						</Button>
						<Button color="error" onClick={onConfirmDeletion}>
							Einträge löschen
						</Button>
						<Button color="inherit" onClick={() => setShowConfirmation(false)}>
							Abbrechen
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
