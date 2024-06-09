import { API_URL } from '@/config'
import { UpdateUser, UpdateUserPassword, parseUserSchema } from '@/validations'
import { fetchApi } from './util'

export const fetchCurrentUser = async () => {
  const user = await fetchApi(API_URL.users.getProfile)
  return parseUserSchema.parse(user)
}

export const updateMyProfile = async (data: UpdateUser) => {
  const user = await fetchApi(API_URL.users.updateProfile, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  return parseUserSchema.parse(user)
}

export const updateMySignature = async (data: { signature: FileList }) => {
  const formData = new FormData()
  const file = data.signature[0]
  formData.append('signature', file)
  const response = await fetch(API_URL.users.updateSignature, {
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

export const updateMyPassword = async (data: UpdateUserPassword) => {
  return await fetchApi(API_URL.users.updatePassword, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
