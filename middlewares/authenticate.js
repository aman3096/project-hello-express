const jsonwebtoken = require("jsonwebtoken");

const authenticate = (req, res, next)=> {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401).send('No Tokeeen');   
  
    if(!token) {
      return res.status(401).send('Access Denied. No token provided')
    }
    try {
      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(400).send('Invalid Token.');
    }
}

  module.exports = authenticate;