const express = require('express');
const { v4: uuidv4 } = require('uuid');
var router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const { Pool } = require('pg');

const authenticate = require('../middlewares/authenticate');

function generateAccessToken() {
    const accessToken = jsonwebtoken.sign({ user: 'your_user_data' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return accessToken;
}
const pool = new Pool({
  user: process.env.DB_USERNAME, // replace with your PostgreSQL username
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, // replace with your database name
  password: process.env.DB_PASSWORD, // replace with your PostgreSQL password
  port: process.env.DB_PORT,
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
  const accessToken = jsonwebtoken.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
  const refreshToken = jsonwebtoken.sign({ email: email}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
  })
  const response = {}
  if (result.rows.length==1) {
    response = {
        accessToken,
        refreshToken
      };
  } else {
    response = { message: "Invalid Credentials" }
    res.status(401);
  }

  return res.json(response);

})

router.post('/auth/register', async (req,res) => {
  try {
    const random_uuid = uuidv4();
    const sql_query = 'INSERT INTO users(id, username, email, password_hash) VALUES($1, $2, $3, $4)';
    const values = [random_uuid, req.body.username, req.body.email, req.body.password ]
    await pool.query(sql_query, values);
    res.send("User Registered Successful");
  } catch(err) {
    console.log(err);
    res.send("Server error occured");
  }

})

router.post('/auth/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' });
  }
  try {
      const accessToken = generateAccessToken(refreshToken);
      res.json({ token: accessToken });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auth/logout', (req,res)=> {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
      return res.status(401).json({ error: 'Unauthorized'});
  }
  try{
    // invalidateToken(token);
    res.clearCookie('your_token_cookie_name'); // Clear any token cookie
    return res.json({ message: 'Logged out successfully' });
  } catch(err) {
    console.error(err);
    return res.status("Server error occurred");
  }
  
})
router.post('/users/profile', authenticate, async (req, res) => {
  const { email } = req.body;
  const query = 'SELECT id, username, email, role from users WHERE email=$1'
  const values = [ email ]
  const result = await pool.query(query,values);
  let output = {}
  if(result.rows.length) {
    output = {
      data: result.rows,
      message: "Profile fetch successful"
    }
  } else {
    output = {
      data: [],
      message: "No data found"
    }
    res.status(204)
  }
  return res.send(output);
  
})


module.exports = router;