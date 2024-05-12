import { fetchApi } from '@/api/util'
import { parseUserSchema } from '@/validations'

export const login = async (username: string, password: string) => {
  const user = await fetchApi('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ name: username, password })
  })
  return parseUserSchema.parse(user)
}

export const logout = async () => fetchApi('/auth/signout')
