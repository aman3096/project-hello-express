const express = require('express');
const { v4: uuidv4 } = require('uuid');
var router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USERNAME, // replace with your PostgreSQL username
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, // replace with your database name
  password: process.env.DB_PASSWORD, // replace with your PostgreSQL password
  port: process.env.DB_PORT,
});
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: Successful response with a list of users.
 */
router.get('/users', (req, res) => {
  // Your logic to fetch and return users
  res.json({ users: [] });
});
/**
 * @swagger
 * /api/auth/login:
 *   get:
 *     summary: Login the users 
 *     description: Login the users using JWT
 *     responses:
 *       200:
 *         description: Successful response with a list of users.
 */
router.post('/auth/login', async (req, res)=> {
  const { email, password } = req.body;
  console.log(`${email} is trying to login ..`);
  const values = [ email, password ]
  const query = 'SELECT * FROM users WHERE email=$1 AND password_hash=$2'
  const result = await pool.query(query,values);
  if (result.rows.length==1) {
    return res.json({
      token: jsonwebtoken.sign({ email: email }, process.env.JWT_SECRET),
    });
  }

  return res
    .status(401)
    .json({ message: "Invalid Credentials" });

})

router.post('/auth/register', async (req,res) => {
  try {
    const random_uuid = uuidv4();
    const sql_query = 'INSERT INTO users(id, username, email, password_hash) VALUES($1, $2, $3, $4)';
    const values = [random_uuid, req.body.username, req.body.email, req.body.password ]
    const result = await pool.query(sql_query, values);
    res.send("User Registered Successful");
  } catch(err) {
    console.log(err);
    res.send("Server error occured");
  }

})
module.exports = router;