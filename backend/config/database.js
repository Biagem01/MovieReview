const mysql = require('mysql2');

// Se hai impostato MYSQL_PUBLIC_URL come variabile d'ambiente su Render
// lo usiamo direttamente, altrimenti fallback ai singoli valori separati
const connectionConfig = process.env.MYSQL_PUBLIC_URL
  ? process.env.MYSQL_PUBLIC_URL
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'moviestar',
    };

const pool = mysql.createPool({
  ...connectionConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();
module.exports = promisePool;
