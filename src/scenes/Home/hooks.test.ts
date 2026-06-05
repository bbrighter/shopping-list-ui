import { act, renderHook } from "@testing-library/react";
import { getDefaultStore } from "jotai";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { piidAtom } from "../../store/atoms.app";
import { resetPollingAtom } from "../../store/items/atoms";
import usePolling from "./hooks";

describe("usePolling", () => {
	beforeAll(() => {
		vi.useFakeTimers();
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	it("called once initially", async () => {
		const fn = vi.fn();

		renderHook(() => usePolling(fn, 10000, []));

		expect(fn).toHaveBeenCalled();
		expect(fn).not.toHaveBeenCalledTimes(2);
	});

	it("called as soon as piid is set", async () => {
		const store = getDefaultStore();
		const fn = vi.fn();

		renderHook(() => usePolling(fn, 10000, []));

		expect(fn).toHaveBeenCalledOnce();

		act(() => store.set(piidAtom, "123"));
		expect(fn).toHaveBeenCalledTimes(2);
	});

	it("called once per interval", async () => {
		const fn = vi.fn();

		renderHook(() => usePolling(fn, 100, []));

		expect(fn).toHaveBeenCalledOnce();
		vi.advanceTimersByTime(50);
		expect(fn).toHaveBeenCalledOnce();
		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(2);
	});

	it("increasing resetPolling postpones the next trigger", async () => {
		const fn = vi.fn();
		const store = getDefaultStore();

		renderHook(() => usePolling(fn, 100, []));

		expect(fn).toHaveBeenCalledOnce();

		vi.advanceTimersByTime(50);
		act(() => store.set(resetPollingAtom, 1));

		vi.advanceTimersByTime(50);
		expect(fn).toHaveBeenCalledOnce();

		vi.advanceTimersByTime(50);
		expect(fn).toHaveBeenCalledTimes(2);
	});
});
