const express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
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

router.post('/', authenticate, async (req, res) => {
    const { name, type, initialBal } = req.body
    const random_uuid = uuidv4();
    try{

        if(!name.length || !type.length || !initialBal.length) {
            res.send("Please do not provide empty entries")
        }
        const query = "INSERT id, name, balance into accounts VALUES ($1, $2, $3, $4)";
        const values = [random_uuid, name, type, initialBal]
        await pool.query(query, values);
        const fetchQuery = "SELECT id, name, balance FROM accounts WHERE name=$1"
        const fetchVals = [name];
        const result = await pool.query(fetchQuery, fetchVals);
        const output = {
            message: "Account added successfully",
            data: result.rows
        } 
        res.send(output);
    } catch(err) {
        console.error(err);
        res.send("Server Error Occurred");
    }
})


router.put('/', authenticate, async (req, res) => {
    const { name, type, initialBal } = req.body
    try{

        if(!name.length || !type.length || !initialBal.length) {
            res.send("Please do not provide empty entries")
        }
        if(type!='Account owner') {
            res.send('No rights found for the users');
        }
        const query = "UPDATE accounts SET name=$1, type=$2, balance=$3)";
        const values = [name, type, initialBal]
        await pool.query(query, values);
        const fetchQuery = "SELECT id, name, balance FROM accounts WHERE name=$1"
        const fetchVals = [name];
        const result = await pool.query(fetchQuery, fetchVals);
        const output = {
            message: "Account updated successfully",
            data: result.rows
        } 
        res.send(output);
    } catch(err) {
        console.error(err);
        res.send("Server Error Occurred");
    }
})

module.exports = router;