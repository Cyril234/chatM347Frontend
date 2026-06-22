

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type ChatType = 'PRIVATE' | 'GROUP'

export type BackendDate = string | number

export type UserData = {
  userUuid: string
  username: string
  email: string
  createdAt: BackendDate
}

export type UserAnonymData = {
  userUuid: string
  username: string
}

export type ChatResponse = {
  chatUuid: string
  creatorUuid: string
  chatType: ChatType
  name: string
  createdAt: BackendDate
  memberUuids: string[]
}

export type MessageResponse = {
  messageUuid: string
  chatUuid: string
  senderUuid: string
  content: string
  createdAt: BackendDate

  username: string | null
}
