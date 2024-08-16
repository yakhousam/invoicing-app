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

  if (response.status === 401) {
    window.location.href = `/login?redirect=${window.location.pathname}`
  }

  if (!response.ok) {
    throw response
  }
  // Only parse as JSON if the response has content
  return response.status === 204 ? null : response.json()
}
