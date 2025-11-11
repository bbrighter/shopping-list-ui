import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { postItemAtom, productsNotInUseAtom } from '../../../store';

type Option = {
    id?: number
    name: string
}

export default function ItemInput() {
    const products = useAtomValue(productsNotInUseAtom)
    const addItem = useSetAtom(postItemAtom)
    const [value, setValue] = useState<Option | null>(null)

    const onChange = async (_: React.SyntheticEvent, v: string | Option | null) => {
        if (typeof (v) == 'string') {
            setValue({ name: v })
            return
        }
        if (v == null) {
            return
        }
        if (typeof (v) == 'object' && 'name' in v) {
            setValue(v)
        }
    }

    useEffect(() => {
        if (value != null) {
            const params = value.id ? { id: value.id } : { name: value.name }
            addItem(params)
        }
        setValue(null)
    }, [value])

    return (
        <Autocomplete
            freeSolo
            options={products}
            getOptionLabel={(o) => typeof (o) == 'string' ? o : o.name}
            renderInput={params => (<TextField {...params} />)}
            onChange={onChange}
            value={value}
            clearOnBlur
        />
    )
}