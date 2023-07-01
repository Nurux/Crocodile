const mysql = require('mysql');

const connection = mysql.createPool({
    host: process.env.HOST, 
    port: process.env.PORT,
    user: process.env.USER, 
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
    connectionLimit: 100, 
    multipleStatements: true, 
});

exports.connection = connection