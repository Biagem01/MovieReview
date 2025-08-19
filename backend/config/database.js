const mysql = require('mysql2');
const { URL } = require('url');

let connectionConfig;

if (process.env.MYSQL_PUBLIC_URL) {
  // Parsing dell'URL
  const dbUrl = new URL(process.env.MYSQL_PUBLIC_URL);
  connectionConfig = {
    host: dbUrl.hostname,
    port: dbUrl.port,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace(/^\//, '') // rimuove lo slash iniziale
  };
} else {
  connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'moviestar',
  };
}

const pool = mysql.createPool({
  ...connectionConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();
module.exports = promisePool;
