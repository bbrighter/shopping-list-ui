import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { deleteListAtom, fetchListAtom } from '../../../store';
import { useSetAtom } from 'jotai';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function FinishListButton() {
    const [loading, setLoading] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [successfullyRemoved, setSuccessfullyRemoved] = useState(false)
    const deleteList = useSetAtom(deleteListAtom)
    const getList = useSetAtom(fetchListAtom)

    const onClick = async () => {
        setLoading(true)
        const ok = await deleteList(false)
        if (ok) {
            setSuccessfullyRemoved(true)
        } else {
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
            setSuccessfullyRemoved(true)
        }
    }

    useEffect(() => {
        if (successfullyRemoved) {
            getList()
        }
    }, [successfullyRemoved])

    return (
        <>
            <Dialog open={showConfirmation}>
                <DialogTitle>Liste löschen nicht möglich</DialogTitle>
                <Box sx={{ padding: '2rem' }}>
                    <Typography>Nicht alle Gegenstände sind abgehakt. Liste löschen und Gegenstände entfernen?</Typography>
                    <ButtonGroup variant='contained' sx={{ pt: '1rem' }}>
                        <Button color='error' onClick={onConfirmDeletion}>Dennoch löschen</Button>
                        <Button onClick={() => setShowConfirmation(false)}>Behalten</Button>
                    </ButtonGroup>
                </Box>

            </Dialog>
            <Button loading={loading} onClick={onClick}>
                Liste abschließen
            </Button>
        </>
    )
}