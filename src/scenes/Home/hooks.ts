import { useAtomValue, useSetAtom } from "jotai";
import type React from "react";
import { useEffect, useRef } from "react";
import { fetchItemsAtom } from "../../store/actions.items";
import { fetchProductsAtom } from "../../store/actions.products";
import { piidAtom } from "../../store/atoms.app";
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
	const piid = useAtomValue(piidAtom);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Must run when PIID is set
	useEffect(() => {
		const fn = () => callbackRef.current();
		let timeout: NodeJS.Timeout | null;

		const start = () => {
			if (resetPolling === 0) fn();
			timeout = setInterval(fn, interval);
		};

		const stop = () => {
			if (timeout) {
				clearInterval(timeout);
				timeout = null;
			}
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") start();
			else stop();
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		if (document.visibilityState === "visible") start();

		return () => {
			stop();
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [resetPolling, piid, interval, ...deps]);
};

export default usePolling;
