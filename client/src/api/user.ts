import { API_URL } from '@/config'
import { parseUserSchema } from '@/validations'
import { fetchApi } from './util'

export const fetchCurrentUser = async () => {
  const user = await fetchApi(API_URL.users.getProfile)
  return parseUserSchema.parse(user)
}
