// wrapper around fetch
export const fetchApi = async (
  endpoint: string,
  options: RequestInit | undefined = {}
) => {
  // await new Promise((resolve) => setTimeout(resolve, 2000))
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options,
    credentials: 'include' // Include auth cookie
  })
  if (!response.ok) {
    throw response
  }
  return response.json()
}
