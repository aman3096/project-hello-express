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

router.get('/', authenticate, async (req, res, next) => {
    try {
        let response;
        let query = "SELECT id, name, target_amount, saved_amount FROM goals";
        const results = await pool.query(query,[]);
        if(results?.rows.length) {
            response = {
                message: "Goals Fetched Successfully",
                data: results.rows
            }
        } else {
            response = {
                message: "No Goals Found",
                data: []
            }
        }
        res.send(response);
    } catch(err) {
        res.send("Server Error Occurred");
    }
})

router.post('/', authenticate, async (req, res, next) => {
    try {
        const { name, targetAmount } = req.body;
        const random_uuid = uuidv4()
        const params = [ random_uuid, name, targetAmount]
        const query = "INSERT INTO goals(id, name, target_amount) VALUES ($1, $2, $3)"
        const result = await pool.query(query, params);
        let response;
        if(result.rows.length) {
            const output = await pool.query("SELECT id, name, target FROM goals WHERE name=$2 and target_amount=$3", params)
            if(output.rows.length) {
                response = {
                    message: "Goal Added Successfully",
                    data: output.rows
                }
            }
        } else {         
            response = {
                message: "Unable to add goal"
            }
        }
        res.send(response)
    } catch(err) {
        res.send("Server Error Occurred")
    }
})

router.put('/:goalId', authenticate, async (req, res, next) => {
    try {
        const { name, targetAmount, savedAmount } = req.body;
        const goal_id = req.params.goalId
        const params = [ goal_id, name, targetAmount, savedAmount]
        const query = "UPDATE goals SET name = $2, target_amount= $3, saved_amount=$4 WHERE id=$1"
        const result = await pool.query(query, params);
        let response;
        if(result.rows.length) {
            const output = await pool.query("SELECT id, name, target FROM goals WHERE goal_id=$1", [goal_id])
            if(output.rows.length) {
                response = {
                    message: "Goal Updated Successfully",
                    data: output.rows
                }
            }
        } else {         
            response = {
                message: "Unable To Update goal"
            }
        }
        res.send(response)
    } catch(err) {
        res.send("Server Error Occurred")
    }
})

router.delete('/:goalId', authenticate, async (req, res, next) => {
    try {
        const goal_id = req.params.goalId
        const params = [ goal_id ]
        const query = "DELETE goals WHERE id=$1"
        const result = await pool.query(query, params);
        let response;
        if(result.rows.length) {
            const output = await pool.query("SELECT id, name, target FROM goals WHERE goal_id=$1", params)
            if(output.rows.length == 0) {
                response = {
                    message: "Goal Deleted Successfully",
                    data: output.rows
                }
            }
        } else {         
            response = {
                message: "Unable To Delete goal"
            }
        }
        res.send(response)
    } catch(err) {
        res.send("Server Error Occurred")
    }
})

module.exports = router;
