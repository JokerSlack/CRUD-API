import express, { json } from 'express'
import session from 'express-session'
import { query, initializeDatabase } from './config/database.js'
import path from 'path'
import { fileURLToPath } from 'url'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.urlencoded({ extended: true}))
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SECRET_SESSION
}))
app.use(express.json())
initializeDatabase()

function verifyJWT() {
  const token = req.headers['x-access-token']
  jsonwebtoken.verify(token, process.env.SECRET_JWT, (err, decoded) => {
    if(err) return res.status(401).end()

    req.userId = decoded.userId

    next()
  })
}

app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
}) // Verifica se a API está rodando

app.post('/login', async (req, res) => {
  const {email, password} = req.body

  // Verificar se o usuário existe
  const user = await query("select * from users where email=$1", [email])
  if (user.length === 0) {
    return res.status(400).json({ message: 'Credenciais inválidas.' })
  }

  // Comparar
  if (password != user[0]['senha']) {
    return res.status(400).json({ message: 'Credenciais invalidas.'})
  }

  // JWT
  const token = jsonwebtoken.sign({userId: 1}, process.env.SECRET_JWT, { expiresIn: 300})
  console.log(token)
  return res.json({
    'auth': true,
    'token': token
  })
})

app.post('/api/createUsers', verifyJWT, (req, res) => {
})
app.post('/api/removeUsers', verifyJWT, (req, res) => {
})
app.post('/api/modifyUsers', verifyJWT, (req, res) => {
})
app.post('/api/readUsers', verifyJWT, (req, res) => {
})


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'))
})
app.get('/crud', verifyJWT, (req, res) => {
})
app.get('/sobre', verifyJWT, (req, res) => {
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`)
})