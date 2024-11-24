// config/database.js
import 'dotenv/config'
import pg from 'pg'
import fs from 'fs'
import path from 'path'

const { Pool } = pg

// Configurar o pool de conexões
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// Função para executar queries
const query = async (text, params) => {
  try {
    const result = await pool.query(text, params)
    return result.rows
  } catch (err) {
    console.error('Erro ao executar query:', err.message)
    throw err
  }
}

// Função para executar o script SQL (database.sql)
const initializeDatabase = async () => {
  const filePath = path.resolve('database.sql')
  const schema = fs.readFileSync(filePath, 'utf-8')
  try {
    await pool.query(schema)
    console.log('Banco de dados inicializado com sucesso.')
  } catch (err) {
    if (err.message.includes('relation "users" already exists')) {
      console.log("A tabela users já existe. Continuando...")
    } else {
    console.error('Erro ao inicializar o banco de dados:', err.message)
    throw err
    }
  }
}

export { query, initializeDatabase }