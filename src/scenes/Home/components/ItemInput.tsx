import Autocomplete, { type AutocompleteChangeReason } from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { toast } from 'sonner'

import { postItemByIdAtom, postItemByNameAtom, selectors } from '../../../store'
import { itemsAtom } from '../../../store/items/atoms'

type Option = {
    id: number
    name: string
}

const isOption = (v: unknown): v is Required<Option> =>
    typeof v === 'object'
    && v !== null
    && 'id' in v
    && typeof v.id === 'number'

const isNewOption = (v: unknown): v is Required<string> => typeof v === 'string'

export function ItemInput() {
    const products = useProductsNotAlreadyUsed()
    const items = useAtomValue(selectors.items.withNames)
    const addItemById = useSetAtom(postItemByIdAtom)
    const addItemByName = useSetAtom(postItemByNameAtom)
    const [value, setValue] = useState<Option | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [loading, setLoading] = useState(false)

    const submitAndReset = async (v: string | Option) => {
        if (isNewOption(v)) {
            await addItemByName({ name: v })
        }
        if (isOption(v)) {
            await addItemById({ id: v.id })
        }
        setValue(null)
        setInputValue('')
    }

    const onChange = async (_: React.SyntheticEvent, v: string | Option | null, reason: AutocompleteChangeReason) => {
        if (v == null) return

        setLoading(true)
        try {
            switch (reason) {
                case 'selectOption': {
                    if (isOption(v)) {
                        await submitAndReset(v)
                    }
                    return
                }

                case 'createOption': {
                    if (!isNewOption(v)) return

                    const trimmed = v.trim()

                    const alreadyExists = items.some(i => i.productName === trimmed)
                    if (alreadyExists) {
                        toast.info('Eintrag existiert schon')
                        return
                    }

                    await submitAndReset(trimmed)
                    return
                }

                case 'clear':
                default:
                    setValue(null)
                    setInputValue('')
            }
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <Autocomplete
            freeSolo
            options={products}
            getOptionLabel={o => isNewOption(o) ? o : o.name}
            renderInput={params => (
                <TextField
                    {...params}
                    slotProps={{
                        ...params.slotProps,
                        input: {
                            ...params.slotProps.input,
                            endAdornment: (
                                <>{loading ? <CircularProgress color="inherit" size={20} /> : null}</>
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
            loading={loading}
        />
    )
}

const useProductsNotAlreadyUsed = () => {
    const products = useAtomValue(selectors.products.nonArchived)
    const items = useAtomValue(itemsAtom)
    return products.filter(p => !items.some(i => i.productId == p.id)).sort((a, b) => a.name.localeCompare(b.name))
}
