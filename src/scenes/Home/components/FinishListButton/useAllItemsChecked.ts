import { useAtomValue } from "jotai";
import { itemsAtom } from "../../../../store/items/atoms";

export const useAllItemsChecked = (): boolean => {
	const items = useAtomValue(itemsAtom);
	return items.every((i) => i.checked);
};
