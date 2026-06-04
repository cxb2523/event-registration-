require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./config/database')
const registrationRoutes = require('./routes/registrations')
const { verifyConnection } = require('./services/emailService')

const app = express()
const PORT = process.env.PORT || 3001

connectDB()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/registrations', registrationRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' })
})

app.use((req, res) => {
  res.status(404).json({ message: '接口不存在' })
})

app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({ message: '服务器内部错误' })
})

app.listen(PORT, async () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
  await verifyConnection()
})
