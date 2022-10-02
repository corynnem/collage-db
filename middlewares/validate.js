const jwt = require('jsonwebtoken')
const { User } = require('../models')


const validate = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next();
    } else if(req.headers.authorization && req.headers.authorization.includes('Bearer')) {
        const { authorization } = req.headers;
        const payload = authorization ? jwt.verify(authorization.includes('Bearer') ? authorization.split(' ')[1]  : authorization, process.env.JWT_SECRET) : undefined

        if(payload) {
            User.findOne({
                where: {
                    id: payload.id
                }
            })
            .then(user => {
                req.user = user;
                next();
            })
        } else {
            res.status(401).json({
                message: 'User not authorized'
            })
        }
    } else {
        res.status(400).json({
            message: 'Request not authorized'
        })
    }
}

module.exports = validate;