import Checkbox from "@mui/material/Checkbox";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useSetAtom } from "jotai";

import { checkItemAtom } from "../../../store";

export default function ItemCheckBox(props: {
	item: { checked: boolean; id: number };
}) {
	const checkItem = useSetAtom(checkItemAtom);
	const { checked, id } = props.item;

	return (
		<ListItemIcon>
			<Checkbox onClick={() => checkItem(id)} checked={checked} />
		</ListItemIcon>
	);
}
