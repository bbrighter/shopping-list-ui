import { useAtomValue } from "jotai";
import { itemsAtom, itemsLoadedAtom } from "../../../../store/items/atoms";

export const useNoItemsFound = () => {
	const numberOfItems = useAtomValue(itemsAtom).length;
	const loaded = useAtomValue(itemsLoadedAtom);
	return loaded && numberOfItems === 0;
};
