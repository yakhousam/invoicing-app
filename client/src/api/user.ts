import { parseUserSchema } from '@/validations'
import { fetchApi } from './util'

export const fetchUser = async () => {
  const user = await fetchApi('/users/me')
  return parseUserSchema.parse(user)
}
