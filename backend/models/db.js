const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "vaultuser",
    password: process.env.DB_PASS || "vaultpass",
    database: "password_vault",
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL connected...");
});

module.exports = db;