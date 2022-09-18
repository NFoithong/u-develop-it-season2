// import inputCheck moduleto verify that user info in the request can create a candidate
const inputCheck = require('./utils/inputCheck');
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
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

// Read operation
// GET a single candidate
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) { console.log(err) };
//     console.log(row);
// });

// Delete operation
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) { console.log(err); }
//     console.log(result);
// });

// CREATE operation
// sql and params variables were assigned to respectively to improve the legibility for the callback function to the database
// const sql = `INSERT INTO candidates(id, first_name, last_name, industry_connected)
//              VALUES(?, ?, ?, ?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) { console.log(err); }
//     console.log(result);
// });

// Create a GET routes 
app.get("/api/candidates", (req, res) => {
    const sql = `SELECT * FROM candidates`
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "Success",
            data: rows
        });
    });
});

// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            data: row
        });
    });
});

// DELETE a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: err.message });
            return;
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'Deleted',
                changes: 'result.affectedRows',
                id: req.params.id
            });
        }
    });
});

// Create a POST route
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates(first_name, last_name, industry_connected)
                VALUES(?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            data: body
        });
    });
});

// Default response for any other request (Not found)
app.use((req, res) => {
    res.status(404).end();
});


// add a function that will start the express.js server on PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});