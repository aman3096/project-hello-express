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
        } else {
            response = {
                message: "Accounts fetch successful",
                data: results.rows
            }
        }
        return res.send(response);
    } catch(err) {
        console.error('Error getting Account:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/transactions', authenticate, async (req,res)=> {
    try {
        const accountId = [req.query.accountId]
        const query = "SELECT id, balance, number, updated_date, type from transactions WHERE account_id=$1";
        const results = await pool.query(query, accountId);
        let response = {};
        if(!results.rows) {
            response = {
                message: "No Entries Found",
                data:[]
            }
        } else {
            response = {
                message: "Accounts fetched successfully",
                data: results.rows
            }
        }
        return res.send(response);
    } catch(err) {
        console.error('Error getting Transactions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/', authenticate, async (req, res) => {
    const { name, type, initialBal } = req.body
    const random_uuid = uuidv4();
    let output;
    try {
        if(!name.length || !type.length || !initialBal.length) {
            output = {
                message: "Please do not provide empty entries",
                data: []
            }
        } else {
            const query = "INSERT id, name, balance into accounts VALUES ($1, $2, $3, $4)";
            const values = [random_uuid, name, type, initialBal]
            await pool.query(query, values);
            const fetchQuery = "SELECT id, name, balance FROM accounts WHERE name=$1"
            const fetchVals = [name];
            const result = await pool.query(fetchQuery, fetchVals);
            output = {
                message: "Account added successfully",
                data: result.rows
            }
        } 
        res.send(output);
    } catch(err) {
        console.error('Error Adding Accounts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/transactions', authenticate, async (req, res) => {
    const { amount, accountId, category, date, type } = req.body
    const random_uuid = uuidv4();
    let output;

    try{
        if(!amount.length || !type.length || !accountId.length || !category.length || !date.length || !type.length) {
            output = {
                message: "Please do not provide empty entries",
                data: []
            }
        } else {
            const fetchQuery = "SELECT * FROM account WHERE id=$2"
            const fetchVals = [accountId];
            const result = await pool.query(fetchQuery, fetchVals);
            if(!result.rows) {
                output = {
                    message: "Account Not Found",
                    data: []
                }
            } else {
                const query = "INSERT id, amount, category, date, type into transactions VALUES ($1, $2, $4, $5, $6) WHERE account_id=$3";
                const values = [random_uuid, amount, accountId, category, date, type]
                await pool.query(query, values);
                output = {
                    message: "Account added successfully",
                    data: result.rows
                } 
            }
        }
        res.send(output);
    } catch(err) {
        console.error('Error Adding Transactions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/', authenticate, async (req, res) => {
    const { name, type, initialBal } = req.body
    let output
    try{

        if(!name.length || !type.length || !initialBal.length) {
            output = {
                message: "Please do not provide empty entries",
                data: result.rows
            } 
        }
        else if(type!='Account owner') {
            output = {
                message: "No rights found for the users",
                data: result.rows
            } 
        } else {
            const query = "UPDATE accounts SET name=$1, type=$2, balance=$3)";
            const values = [name, type, initialBal]
            await pool.query(query, values);
            const fetchQuery = "SELECT id, name, balance FROM accounts WHERE name=$1"
            const fetchVals = [name];
            const result = await pool.query(fetchQuery, fetchVals);
            output = {
                message: "Account updated successfully",
                data: result.rows
            }
        } 
        res.send(output);
    } catch(err) {
        console.error('Error Updating Accounts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/transactions', authenticate, async (req, res) => {
    const { amount, accountId, category, date, type } = req.body
    let output;
    try{
        if(!amount.length || !account.length || !category.length || !date.length || !type.length) {
           output = {
            message: "Empty entries given",
            data: []
           }
        }
        else if(type!='Account owner') {
            output = {
                message:'No rights found for the users',
                data:[]
            }
        } else {
            const query = "UPDATE transactions SET amount=$1, category=$3, date=$4, type=$5) WHERE account_id=$2";
            const values = [amount, accountId, category, date, type]
            await pool.query(query, values);
            const fetchQuery = "SELECT * FROM transactions WHERE account_id=$1"
            const fetchVals = [name];
            const result = await pool.query(fetchQuery, fetchVals);
            output = {
                message: "Account updated successfully",
                data: result.rows
            }
        }
        res.send(output);
    } catch(err) {
        console.error('Error Updating Transactions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/', authenticate, async (req, res) => {
    try {
        const { id } = req.query
        let output;
        if(!id) {
        output = "Must send correct id";
        } else {
            const searchQuery = "SELECT * FROM accounts WHERE id=$1";
            const values = [id]
            const result = await pool.query(searchQuery, values)
            if(!result.rows)
                output = `No account found with the id ${id}`
            else{
                const deleteQuery = `DELETE FROM accounts WHERE id=$1`;
                await pool.query(deleteQuery, values);
                output = `Account Deleted Successfully`
            }
        }
        res.send(output);
    } catch(err) {
        console.error('Error Updating Accounts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/transactions', authenticate, async (req, res) => {
    try {
        const { accountId } = req.query
        let output;
        if(!id) {
        output = "Must send correct id";
        } else {
            const searchQuery = "SELECT * FROM accounts WHERE id=$1";
            const values = [accountId]
            const result = await pool.query(searchQuery, values)
            if(!result.rows)
                output = `No account found with the id ${id}`
            else{
                const deleteQuery = `DELETE FROM transactions WHERE account_id=$1`;
                await pool.query(deleteQuery, values);
                output = `Transaction Deleted Successfully `
            }
        }
        res.send(output);
    } catch(err) {
        console.error('Error Deleting Transactions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }

})
module.exports = router;