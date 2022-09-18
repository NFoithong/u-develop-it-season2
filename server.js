// import mysql2
const mysql = require("mysql2");
// import express
const express = require("express");

// add the PORT designation and the app expression
const PORT = process.env.PORT || 3001;
const app = express();

// add expresss.js middleware
app.use(express.urlencoded({ extend: true }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection({
        host: 'localhost',
        // your username
        user: 'root',
        // your password
        password: 'Osara23!',
        database: 'election'
    },
    console.log("Connected to the election database")
);

// build the database calls - query the database to test the connection
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});

app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

// Default response for any other request (Not found)
app.use((req, res) => {
    res.status(404).end();
});


// add a function that will start the express.js server on PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});