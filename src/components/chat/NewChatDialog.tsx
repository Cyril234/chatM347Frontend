import { useMemo, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useChat } from '../../context/chat.context.ts'
import { useAuth } from '../../context/auth.context.ts'
import type { ChatType } from '../../types/api.ts'

type Option = { uuid: string; username: string }

export default function NewChatDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, createChat } = useChat()
  const { user } = useAuth()
  const [mode, setMode] = useState<ChatType>('PRIVATE')
  const [groupName, setGroupName] = useState('')
  const [direct, setDirect] = useState<Option | null>(null)
  const [members, setMembers] = useState<Option[]>([])

  const options = useMemo<Option[]>(
    () =>
      Object.entries(state.usersByUuid)
        .filter(([uuid]) => uuid !== user?.userUuid)
        .map(([uuid, username]) => ({ uuid, username }))
        .sort((a, b) => a.username.localeCompare(b.username)),
    [state.usersByUuid, user?.userUuid],
  )

  const reset = () => {
    setMode('PRIVATE')
    setGroupName('')
    setDirect(null)
    setMembers([])
  }

  const close = () => {
    reset()
    onClose()
  }

  const canCreate =
    mode === 'PRIVATE' ? direct !== null : groupName.trim().length > 0 && members.length > 0

  const handleCreate = () => {
    if (mode === 'PRIVATE') {
      if (!direct) return
      createChat({ name: direct.username, chatType: 'PRIVATE', memberUuids: [direct.uuid] })
    } else {
      if (!groupName.trim() || members.length === 0) return
      createChat({
        name: groupName.trim(),
        chatType: 'GROUP',
        memberUuids: members.map((m) => m.uuid),
      })
    }
    close()
  }

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>Neuer Chat</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <ToggleButtonGroup
            color="primary"
            exclusive
            fullWidth
            value={mode}
            onChange={(_e, v) => {
              if (v) setMode(v as ChatType)
            }}
          >
            <ToggleButton value="PRIVATE">Direkt</ToggleButton>
            <ToggleButton value="GROUP">Gruppe</ToggleButton>
          </ToggleButtonGroup>

          {mode === 'PRIVATE' ? (
            <Autocomplete
              options={options}
              value={direct}
              onChange={(_e, v) => setDirect(v)}
              getOptionLabel={(o) => o.username}
              isOptionEqualToValue={(o, v) => o.uuid === v.uuid}
              renderInput={(params) => <TextField {...params} label="Person auswaehlen" autoFocus />}
              noOptionsText="Keine weiteren Nutzer"
            />
          ) : (
            <>
              <TextField
                label="Gruppenname"
                fullWidth
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Autocomplete
                multiple
                options={options}
                value={members}
                onChange={(_e, v) => setMembers(v)}
                getOptionLabel={(o) => o.username}
                isOptionEqualToValue={(o, v) => o.uuid === v.uuid}
                renderInput={(params) => <TextField {...params} label="Mitglieder" />}
                noOptionsText="Keine weiteren Nutzer"
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Abbrechen</Button>
        <Button variant="contained" disabled={!canCreate} onClick={handleCreate}>
          Erstellen
        </Button>
      </DialogActions>
    </Dialog>
  )
}
