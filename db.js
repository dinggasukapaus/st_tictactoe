const Pool = require('pg').Pool
const pool = new Pool({
  
  // !server
  user: 'xudfybtichiljh',
  host: 'ec2-34-225-82-212.compute-1.amazonaws.com',
  database: 'dfn92igfsgk11o',
  password: '1571bbd895943aa4d2e8872528521d630b59dabc8d34dfb96248a414cd877e9e',
  port: 5432,

  //! local
  // user: 'postgres',
  // host: 'localhost',
  // database: 'db_tictactoe',
  // password: 'Senollol123',
  // port: 5432,
})


module.exports =pool;