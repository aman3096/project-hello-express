import * as express from 'express';
import { pool } from '../app.js';
import { v4 as uuid } from 'uuid';
var router = express.Router();

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
router.post('/auth/login', (req, res)=> {

  const jwt_const_token = {
    "token": "JWT Token", 
    "user": {
      "id":"random-constant-id",
      "username": "random-constant-username",
      "email": req.body.email
    }    
  }
  res.json(jwt_const_token)
})

router.post('/auth/register', async (req,res) => {
  try {
    const random_uuid = uuid();
    const sql_query = 'INSERT INTO users(id, username, email, password_hash) VALUES($1, $2, $3, $4)';
    const values = [random_uuid, req.body.name, req.body.email, req.body.password ]
    const result = await pool.query(sql_query, values);
    res.send("User Registered Successful");
  } catch(err) {

    res.send("Server error occured");
  }

})
export default router;