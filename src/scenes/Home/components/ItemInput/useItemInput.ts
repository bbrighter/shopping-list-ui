import { useAtomValue, useSetAtom } from "jotai";
import {
	postItemByIdAtom,
	putItemByNameAtom,
	selectors,
} from "../../../../store";
import { itemsAtom } from "../../../../store/items/atoms";

export const useItemInput = () => {
	const products = useProductsNotAlreadyUsed();
	const items = useAtomValue(selectors.items.withNames);
	const addItemById = useSetAtom(postItemByIdAtom);
	const addItemByName = useSetAtom(putItemByNameAtom);

	return { products, items, addItemById, addItemByName };
};

const useProductsNotAlreadyUsed = () => {
	const products = useAtomValue(selectors.products.nonArchived);
	const items = useAtomValue(itemsAtom);
	return products
		.filter((p) => !items.some((i) => i.productId === p.id))
		.sort((a, b) => a.name.localeCompare(b.name));
};
