module.exports = (req, res, next) => {

    let jwt = require('jsonwebtoken'),
        config = require(__dirname + '/../config/config')

    res.sign = (data) => {
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + config.jwt.authentification.expiration,
            data: data
        }, config.jwt.authentification.secret)
    }

    next()

}