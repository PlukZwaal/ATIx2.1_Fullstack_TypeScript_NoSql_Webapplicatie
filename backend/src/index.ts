import express, { Application, Request, Response } from 'express'

const app: Application = express()
const PORT = process.env.PORT || 4000

app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running! 🚀')
})

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})
