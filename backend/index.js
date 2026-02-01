import express from 'express'
const app = express()
dotenv.config()
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import geminiResponse from './gemini.js'

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.get('/', async (req, res) => {
  let prompt = req.query.prompt
  let data =await geminiResponse(prompt)
  return res.json(data)
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  connectDb()
  console.log(`backend started at port ${PORT}`)
})