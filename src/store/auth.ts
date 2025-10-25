import { atomWithStorage } from "jotai/utils";
import { authApi } from "../api/api";
import { atom } from "jotai";

export const token = atomWithStorage('token', '')

export const login = atom(null, async (_get, set, { password, userName }: { password: string, userName: string }) => {
    const resp = await authApi.Login({ password, userName })
    set(token, resp.token)
})
