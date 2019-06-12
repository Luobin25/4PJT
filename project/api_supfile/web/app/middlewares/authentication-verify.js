module.exports = (req, res, next) => {

    let jwt = require('jsonwebtoken'),
        config = require(__dirname + '/../config/config'),
        token = req.body.token || req.query.token || req.headers['authorization']

    if (token) {
        jwt.verify(token, config.jwt.authentification.secret, (err, decoded) => {
            if (err) res.error('Unauthorized', 401)
            else {
                req.user = decoded.data
                next()
            }
        })
    } else res.error('Unauthorized', 401)
}