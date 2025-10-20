// mysql db connection
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT, // Asegúrate de incluir el puerto
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

export default db;
