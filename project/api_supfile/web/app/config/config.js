module.exports = {
    app: {
        name: 'api',
        port: 80,
        domain: 'http://localhost:80'
    },
    db: {
        string: 'mongodb://mongo:27017/api'
    },
    jwt: {
        authentification: {
            expiration: 86400,
            secret: '8b1c05b43e64699f2a8ac0102e4b9422b66e5967'
        },
        password: {
            expiration: 86400,
            secret: '27d0253e01ed13c2582e96dcd191aa0b230e60d7'
        }
    },
    routes: {
        public: ['general']
    }
}
