const path = require('path')
const mode = process.env.NODE_ENV
require('dotenv').config({ path: `${path.join(__dirname, '..')}/.env-${mode}` })

const config = {
  "username": process.env.DB_USER,
  "password": process.env.DB_PASS,
  "port": process.env.DB_PORT,
  "database": process.env.DB_NAME,
  "host": process.env.DB_HOST,
  "dialect": process.env.DB_DRIVER
}

module.exports = config
