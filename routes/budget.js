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
        console.error('Error getting Budgets:', err);
        res.status(500).json({ error: 'Internal server error' });
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
        console.error('Error getting Budget id:', err);
        res.status(500).json({ error: 'Internal server error' });
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
        console.error('Error adding Budgets:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
  })

  router.put('/:budgetId', authenticate, async (req, res, next) => {
    try {
        const { category, amount } = req.body; 
        const id = req.params.budgetId
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
        console.error('Error updating Budget id:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
  }) 

  router.delete('/:budgetId', authenticate, async (req, res, next) => {
    try {
        const { budgetId } = req.params;
        const queryFind = "SELECT * FROM budgets WHERE id = $1";
        const params = [ budgetId ];
        const deleteQuery = "DELETE * FROM budgets WHERE id = $1";
        const result = await pool.query(queryFind, params);
        let response = {}
        if(result?.rows.length) {
            await pool.query(deleteQuery, params);
            response = {
                message: `${budgetId} Deleted Successfully`,
            }
        } else {
            response = {
                message: `No ${budgetId} found`
            }
        }
        res.send(response);
    } catch(err) {
        console.error('Error deleting BudgetId:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
  })
  
  module.exports = router;
  