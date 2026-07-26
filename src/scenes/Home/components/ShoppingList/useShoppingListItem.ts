import { useSetAtom } from "jotai";
import {
	changeItemQuantityAtom,
	checkItemAtom,
	deleteItemAtom,
} from "../../../../store";

export const useShoppingListItem = () => {
	const onCheck = useSetAtom(checkItemAtom);
	const onDelete = useSetAtom(deleteItemAtom);
	const onUpdateQuantity = useSetAtom(changeItemQuantityAtom);

	return { onCheck, onDelete, onUpdateQuantity };
};
