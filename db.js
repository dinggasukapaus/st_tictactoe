const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_tictactoe',
  password: 'Senollol123',
  port: 5432,
})


module.exports =pool;