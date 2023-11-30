import express, { type Application, type Request, type Response } from 'express'

const PORT = process.env.PORT ?? 3000

const app: Application = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`)
})
