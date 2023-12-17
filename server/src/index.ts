import server from '@/app'
import '@/db'

const PORT = process.env.PORT ?? 3000

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
