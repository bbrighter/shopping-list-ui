import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import { useSetAtom } from 'jotai'
import { useState } from 'react'

import { createListAtom, deleteListAtom } from '../../../store'
import { FullSizeLoader } from '../../Components'

export default function FinishListButton() {
    const [loading, setLoading] = useState(false)
    const [creationLoading, setCreationLoading] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const deleteList = useSetAtom(deleteListAtom)
    const createList = useSetAtom(createListAtom)

    const onClick = async () => {
        setLoading(true)
        const ok = await deleteList(false)
        if (ok) {
            await createNewList()
        }
        else {
            setShowConfirmation(true)
        }
        setLoading(false)
    }

    const onConfirmDeletion = async () => {
        setLoading(true)
        const ok = await deleteList(true)
        setLoading(false)
        if (ok) {
            setShowConfirmation(false)
            await createNewList()
        }
    }

    const createNewList = async () => {
        setCreationLoading(true)
        await createList()
        setCreationLoading(false)
    }

    return (
        <>
            <FullSizeLoader open={creationLoading} />
            <Dialog open={showConfirmation}>
                <DialogTitle>Liste enthält noch Ungekauftes</DialogTitle>
                <Box sx={{ padding: '2rem' }}>
                    <Typography>Nicht alle Gegenstände sind abgehakt. Liste löschen und Gegenstände entfernen?</Typography>
                    <ButtonGroup variant="contained" sx={{ pt: '1rem' }} color="inherit">
                        <Button
                            color="error"
                            onClick={onConfirmDeletion}
                        >
                            Dennoch löschen
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => setShowConfirmation(false)}
                        >
                            Behalten
                        </Button>
                    </ButtonGroup>
                </Box>

            </Dialog>
            <Button loading={loading} onClick={onClick}>
                Liste abschließen
            </Button>
        </>
    )
}
