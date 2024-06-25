import { fetchApi } from '@/api/util'
import { API_URL } from '@/config'
import { parseUserSchema } from '@/validations'

export const login = async (userName: string, password: string) => {
  const user = await fetchApi(API_URL.auth.login, {
    method: 'POST',
    body: JSON.stringify({ userName, password })
  })
  return parseUserSchema.parse(user)
}

export const logout = async () =>
  fetchApi(API_URL.auth.logout, { method: 'POST' })
