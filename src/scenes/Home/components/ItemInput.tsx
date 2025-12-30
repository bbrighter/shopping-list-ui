import Autocomplete, { type AutocompleteChangeReason } from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'

import { postItemAtom, productsNotInUseAtom } from '../../../store'

type Option = {
    id?: number
    name: string
}

export function ItemInput() {
    const products = useAtomValue(productsNotInUseAtom)
    const addItem = useSetAtom(postItemAtom)
    const [value, setValue] = useState<Option | null>(null)
    const [inputValue, setInputValue] = useState('')

    const submitAndReset = async (v: string | Option) => {
        try {
            if (typeof (v) == 'string') {
                await addItem({ name: v })
            }
            if (typeof (v) == 'object' && 'id' in v && typeof (v.id) == 'number') {
                await addItem({ id: v.id })
            }
            setValue(null)
            setInputValue('')
        }
        catch { /* empty */ }
    }

    const onChange = async (_: React.SyntheticEvent, v: string | Option | null, reason: AutocompleteChangeReason) => {
        if (v == null) return
        switch (reason) {
            case 'selectOption':
                if (typeof (v) == 'object' && 'id' in v && typeof (v.id) == 'number') {
                    await submitAndReset(v)
                }
                break
            case 'createOption':
                if (typeof (v) == 'string') {
                    await submitAndReset(v)
                }
                break
            case 'clear':
                setValue(null)
                setInputValue('')
                break
            default:
                setValue(null)
                setInputValue('')
        }
    }

    return (
        <Autocomplete
            freeSolo
            options={products}
            getOptionLabel={o => typeof (o) == 'string' ? o : o.name}
            renderInput={params => (<TextField {...params} />)}
            onChange={onChange}
            value={value}
            inputValue={inputValue}
            onInputChange={(_, v) => setInputValue(v)}
            clearOnBlur
        />
    )
}
