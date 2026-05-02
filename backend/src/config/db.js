const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'woodflow',
  password: process.env.DB_PASSWORD || 'woodflow123',
  database: process.env.DB_NAME || 'woodflow_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
