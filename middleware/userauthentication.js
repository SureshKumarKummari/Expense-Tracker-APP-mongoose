require('dotenv').config();

const users=require('../models/users');

const secretKey = process.env.SECRET_KEY;

const jwt = require('jsonwebtoken');

exports.token =(id)=>{
    //console.log(id);
     return jwt.sign({userId:id}, secretKey, { expiresIn: '1h' });
}

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log("from 1",token);
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authorization token not found' });
        }

        const decoded = jwt.verify(token, secretKey);
        const user = await users.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user; // Attach the user object to the request for use in subsequent middleware/functions
        next(); // Proceed to the next middleware/function
    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
};
