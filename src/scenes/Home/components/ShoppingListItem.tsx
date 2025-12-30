import 'react-swipeable-list/dist/styles.css'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import UnpublishedIcon from '@mui/icons-material/Unpublished'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { useSetAtom } from 'jotai'
import { LeadingActions, SwipeableListItem, SwipeAction, TrailingActions } from 'react-swipeable-list'

import { checkItemAtom, deleteItemAtom, type Item } from '../../../store'
import ItemCheckBox from './ItemCheckBox'
import ItemSecondaryAction from './ItemSecondaryAction'

export const ShoppingListItem = ({ it }: { it: Item }) => {
  const check = useSetAtom(checkItemAtom)
  const deleteItem = useSetAtom(deleteItemAtom)

  const checkButtonIcon = it.checked ? <UnpublishedIcon /> : <CheckCircleIcon />

  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction onClick={() => check(it.id)}>
        <Button
          variant="contained"
          color="info"
          endIcon={checkButtonIcon}
        />
      </SwipeAction>
    </LeadingActions>
  )

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction
        onClick={() => deleteItem(it.id)}
        destructive
      >
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
        />
      </SwipeAction>
    </TrailingActions>
  )

  return (
    <SwipeableListItem
      threshold={0.5}
      leadingActions={leadingActions()}
      trailingActions={trailingActions()}
    >
      <ListItem secondaryAction={<ItemSecondaryAction item={it} />}>
        <ItemCheckBox item={it} />
        <ListItemText primary={it.productName || 'no name'} secondary={it.quantity} />
      </ListItem>
    </SwipeableListItem>
  )
}
