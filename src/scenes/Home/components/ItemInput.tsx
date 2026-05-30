import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { toast } from 'sonner'

import { postItemByIdAtom, postItemByNameAtom, selectors, updateProductsAtom } from '../../../store'
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
    const nameIsInUse = useNameIsInUse()
    const addItemById = useSetAtom(postItemByIdAtom)
    const addItemByName = useSetAtom(postItemByNameAtom)
    const updateProduct = useSetAtom(updateProductsAtom)
    const [value, setValue] = useState<Option | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [loading, setLoading] = useState(false)

    const submitAndReset = async (v: string | Option) => {
        if (isNewOption(v)) {
            const product = nameIsInUse(v)
            if (!product) {
                await addItemByName({ name: v })
            }
            else {
                await addItemById({ id: product.id })
                if (product.archived) {
                    await updateProduct(product.id, { archive: false })
                }
            }
        }

        if (isOption(v)) {
            await addItemById({ id: v.id })
        }
        setValue(null)
        setInputValue('')
    }

    const onChange = async (_: React.SyntheticEvent, v: string | Option | null) => {
        if (v == null) return

        setLoading(true)
        try {
            if (isOption(v)) {
                await submitAndReset(v)
            }
            if (isNewOption(v)) {
                const trimmed = v.trim()
                const alreadyExists = items.some(i => i.productName === trimmed)
                if (alreadyExists) {
                    toast.info('Eintrag existiert schon')
                    return
                }
                await submitAndReset(trimmed)
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

const useNameIsInUse = () => {
    const allProducts = useAtomValue(selectors.products.sorted)
    return (name: string) => {
        return allProducts.find(p => p.name === name)
    }
}
