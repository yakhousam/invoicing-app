import { API_URL } from '@/config'
import { UpdateUser, parseUserSchema } from '@/validations'
import { fetchApi } from './util'

export const fetchCurrentUser = async () => {
  const user = await fetchApi(API_URL.users.getProfile)
  return parseUserSchema.parse(user)
}

export const updateUser = async (data: UpdateUser, userId: string) => {
  const user = await fetchApi(API_URL.users.updateOne(userId), {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  return parseUserSchema.parse(user)
}
