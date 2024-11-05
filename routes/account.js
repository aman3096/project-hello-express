const express = require('express');
var router = express.Router();
const { Pool } = require('pg');

const authenticate = require('../middlewares/authenticate');
const pool = new Pool({
    user: process.env.DB_USERNAME, 
    host: process.env.DB_HOST,
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

router.get('/', authenticate, async (req,res)=> {
    try {
        const name = [req.query.name]
        const query = "SELECT id, name, balance, updated_at from accounts WHERE name=$1";
        const results = await pool.query(query, name);
        let response = {};
        if(!results.rows) {
            response = {
                message: "No Entries Found",
                data:[]
            }
            return res.send(response);
        } else {
            response = {
                message: "Accounts fetch successful",
                data: results.rows
            }
        }
        return res.send(response);
    } catch(err) {
        console.error(err);
        return res.status("Server error occurred");
    }
})
module.exports = router;