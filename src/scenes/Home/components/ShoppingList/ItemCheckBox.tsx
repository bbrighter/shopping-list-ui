import Checkbox from "@mui/material/Checkbox";
import ListItemIcon from "@mui/material/ListItemIcon";

export default function ItemCheckBox(props: {
	item: { checked: boolean; id: number };
	onCheck: (id: number) => Promise<void>;
}) {
	const { checked, id } = props.item;

	return (
		<ListItemIcon>
			<Checkbox onClick={() => props.onCheck(id)} checked={checked} />
		</ListItemIcon>
	);
}
