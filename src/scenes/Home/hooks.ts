import { useAtomValue, useSetAtom } from "jotai";
import type React from "react";
import { useEffect, useRef } from "react";

import { fetchItemsAtom } from "../../store/actions.items";
import { fetchProductsAtom } from "../../store/actions.products";
import { itemsVersionAtom, resetPollingAtom } from "../../store/items/atoms";
import { productsVersionAtom } from "../../store/products/atoms";

export const useItemGetter = () => {
	const itemsVersion = useAtomValue(itemsVersionAtom);
	const getItems = useSetAtom(fetchItemsAtom);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <A new itemVersion should trigger a request>
	useEffect(() => {
		getItems();
	}, [itemsVersion, getItems]);
};

export const useProductGetter = () => {
	const productsVersion = useAtomValue(productsVersionAtom);
	const getProducts = useSetAtom(fetchProductsAtom);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <A new product version should trigger a request>
	useEffect(() => {
		getProducts();
	}, [productsVersion, getProducts]);
};

const usePolling = (
	callback: () => Promise<void>,
	interval: number,
	deps: React.DependencyList,
) => {
	const resetPolling = useAtomValue(resetPollingAtom);
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		let id: NodeJS.Timeout | null;
		const tick = () => callbackRef.current();

		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") {
				if (resetPolling === 0) tick();
				id = setInterval(tick, interval);
			} else if (id) {
				clearInterval(id);
				id = null;
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		handleVisibilityChange();

		return () => {
			if (id) clearInterval(id);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resetPolling, interval, ...deps]);
};

export default usePolling;
