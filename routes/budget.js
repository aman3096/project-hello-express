const express = require('express');
const { v4: uuidv4 } = require('uuid');
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

router.get('/', authenticate, async (req, res, next)=> {
    try {
        const query = 'SELECT id, category, limit_amount from budgets';
        const results = await pool.query(query,[]);
        const data = {
            message: "Budgets fetched successfully",
            data: results.rows
        }
        res.send(data);
    } catch(err) {
        res.send('Server Error Occurred')
    }
  });

router.get('/:id', authenticate, async (req, res, next)=> {
    try {
        const query_id = req.params.id;
        const query = 'SELECT id, category, limit_amount from budgets WHERE id=$1';
        const results = await pool.query(query, [query_id]);
        let data;
        if(!results.rows.length) {
            data = {
                message: `No Budgets Found for given id ${query_id}`,
                data: []
            }
        }
        else {
            data = {
                message: "Budgets fetched successfully",
                data: results.rows
            }
        }
        res.send(data);
    } catch(err) {
        res.send('Server Error Occurred')
    }
  });

  router.post('/', authenticate, async (req, res, next) => {
    try {
        const { category, amount } = req.body; 
        const random_uuid = uuidv4();
        const params = [ random_uuid, category, amount ]
        const query = "INSERT INTO budgets( id, category, limit_amount) VALUES ($1, $2, $3)"
        const results = await pool.query(query, params);
        let response = {};
        if(results.rows) {
            response = {
                message: "Values inserted successfully",
                data: `Values: ${category}, ${amount}`
            }
        }
        res.send(response);
    } catch(err) {
        res.send("Server Error Occurred");
    }
  })

  router.put('/', authenticate, async (req, res, next) => {
    try {
        const { category, amount } = req.body; 
        const id = req.params.id
        const params = [ amount, id ]
        const query = "UPDATE budgets SET limit_amount= $1 WHERE id = $2"
        const results = await pool.query(query, params);
        let response = {};
        if(results.rows) {
            response = {
                message: "Values updated successfully",
                data: `Values: ${category}, ${amount}`
            }
        }
        res.send(response);
    } catch(err) {
        res.send("Server Error Occurred");
    }
  })  
  
  module.exports = router;
  