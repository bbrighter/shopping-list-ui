import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { atoms, fetchProductsAtom, selectors } from "../../../store";
import { ProductManagementItem } from "./ProductManagementItem";

export const ProductManagement = () => {
	const [showArchived, setShowArchived] = useState(false);
	const getProducts = useSetAtom(fetchProductsAtom);
	const [open, setOpen] = useAtom(atoms.products.isManagementOpen);
	const products = useAtomValue(selectors.products.sorted);
	const nonArchivedProducts = useAtomValue(selectors.products.nonArchived);
	const visibleProducts = showArchived ? products : nonArchivedProducts;

	useEffect(() => {
		getProducts();
	}, [getProducts]);

	return (
		<Dialog open={open} onClose={() => setOpen(false)} fullWidth>
			<DialogTitle>Verwaltung</DialogTitle>
			<DialogContent>
				<FormControlLabel
					label="Archivierte anzeigen"
					control={
						<Switch
							value={showArchived}
							onClick={() => setShowArchived(!showArchived)}
						/>
					}
				/>
				{visibleProducts.map((p) => (
					<ProductManagementItem key={p.id} {...p} />
				))}
			</DialogContent>
		</Dialog>
	);
};
