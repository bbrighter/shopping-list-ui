import Autocomplete, { type AutocompleteChangeReason } from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import { useAtomValue, useSetAtom } from 'jotai'
import { Fragment, useState } from 'react'

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
    const [loading, setLoading] = useState(false)

    const submitAndReset = async (v: string | Option) => {
        if (typeof (v) == 'string') {
            await addItem({ name: v })
        }
        if (typeof (v) == 'object' && 'id' in v && typeof (v.id) == 'number') {
            await addItem({ id: v.id })
        }
        setValue(null)
        setInputValue('')
    }

    const onChange = async (_: React.SyntheticEvent, v: string | Option | null, reason: AutocompleteChangeReason) => {
        if (v == null) return
        setLoading(true)
        switch (reason) {
            case 'selectOption':
                if (typeof (v) == 'object' && 'id' in v && typeof (v.id) == 'number') {
                    await submitAndReset(v)
                    setLoading(false)
                }
                break
            case 'createOption':
                if (typeof (v) == 'string') {
                    await submitAndReset(v)
                    setLoading(false)
                }
                break
            case 'clear':
                setValue(null)
                setInputValue('')
                setLoading(false)
                break
            default:
                setValue(null)
                setInputValue('')
                setLoading(false)
        }
    }

    return (
        <Autocomplete
            freeSolo
            options={products}
            getOptionLabel={o => typeof (o) == 'string' ? o : o.name}
            renderInput={params => (
                <TextField
                    {...params}
                    slotProps={{
                        ...params.slotProps,
                        input: {
                            ...params.slotProps.input,
                            endAdornment: (
                                <Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                </Fragment>
                            ),
                        },
                    }}
                />
            )}
            onChange={onChange}
            value={value}
            inputValue={inputValue}
            onInputChange={(_, v) => setInputValue(v)}
            clearOnBlur
            loading
        />
    )
}
