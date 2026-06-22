import Avatar from '@mui/material/Avatar'
import { colorFromString, initials } from '../../utils/format.ts'

export default function UserAvatar({ name, size = 40 }: { name: string; size?: number }) {
  const safe = name || '?'
  return (
    <Avatar
      sx={{
        bgcolor: colorFromString(safe),
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {initials(safe)}
    </Avatar>
  )
}
