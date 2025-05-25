import mysql from 'mysql2';

let connection: mysql.Connection | null = null;

const ConnectionRetryTimeout = 3000;

function connectDB(): Promise<mysql.Connection> {
  if (connection) return Promise.resolve(connection);

  return new Promise((resolve, reject) => {
    const newConnection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4'
    });

    newConnection.connect(err => {
      if (err) {
        console.error(err.message, 'MySQL connection failed. Retrying ...');
        setTimeout(() => {
          connectDB().then(resolve).catch(reject);
        }, ConnectionRetryTimeout);
        return;
      }

      connection = newConnection;

      connection.on('error', (err) => {
        console.error('MySQL error:', err.message);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          connection = null;
          connectDB().catch(console.error);
        } else {
          throw err;
        }
      });

      resolve(connection);
    });
  });
}

export const getDBConnection = async (): Promise<mysql.Connection> => {
  return connectDB();
};
