const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret-string-for-jwt';

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (e) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};