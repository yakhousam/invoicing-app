import { API_URL } from '@/config'
import { UpdateUser, parseUserSchema } from '@/validations'
import { fetchApi } from './util'

export const fetchCurrentUser = async () => {
  const user = await fetchApi(API_URL.users.getProfile)
  return parseUserSchema.parse(user)
}

export const updateUserProfile = async (data: UpdateUser, userId: string) => {
  const user = await fetchApi(API_URL.users.updateProfile(userId), {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  return parseUserSchema.parse(user)
}

export const updateUserSignature = async (
  data: { signature: FileList },
  userId: string
) => {
  const formData = new FormData()
  const file = data.signature[0]
  formData.append('signature', file)
  const response = await fetch(API_URL.users.updateSignature(userId), {
    method: 'PUT',
    body: formData,
    credentials: 'include'
  })
  if (!response.ok) {
    throw response
  }
  const user = await response.json()
  return parseUserSchema.parse(user)
}
