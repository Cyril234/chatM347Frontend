import { useMemo, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useChat } from '../../context/chat.context.ts'
import { useAuth } from '../../context/auth.context.ts'
import type { ChatResponse } from '../../types/api.ts'

type Option = { uuid: string; username: string }

export default function GroupSettingsDialog({
  onClose,
  chat,
}: {
  onClose: () => void
  chat: ChatResponse
}) {
  const { state, editChat, usernameOf } = useChat()
  const { user } = useAuth()
  const selfUuid = user?.userUuid ?? ''
  const [name, setName] = useState(chat.name)
  const [members, setMembers] = useState<Option[]>(() =>
    chat.memberUuids
      .filter((u) => u !== selfUuid)
      .map((u) => ({ uuid: u, username: usernameOf(u) })),
  )

  const options = useMemo<Option[]>(
    () =>
      Object.entries(state.usersByUuid)
        .filter(([uuid]) => uuid !== selfUuid)
        .map(([uuid, username]) => ({ uuid, username }))
        .sort((a, b) => a.username.localeCompare(b.username)),
    [state.usersByUuid, selfUuid],
  )

  const canSave = name.trim().length > 0 && members.length > 0

  const handleSave = () => {
    if (!canSave) return
    const memberUuids = [selfUuid, ...members.map((m) => m.uuid)]
    editChat({ chatUuid: chat.chatUuid, name: name.trim(), memberUuids })
    onClose()
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Gruppeneinstellungen</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Gruppenname"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <Typography variant="caption" color="text.secondary">
            Du bleibst immer Mitglied der Gruppe. Entfernte Mitglieder verlieren den Zugriff auf
            den Chat.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" disabled={!canSave} onClick={handleSave}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  )
}
