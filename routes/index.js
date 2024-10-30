var express = require('express');
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
router.post('/api/auth/login', (req, res)=> {
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
module.exports = router;