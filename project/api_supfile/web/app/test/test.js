describe('API', () => {
    let request = require('request'),
        fs = require('fs'),
        config = require(__dirname + '/../config/config'),
        users = [],
        data = {
            url: config.app.domain + '/signup',
            method: 'POST',
            json: {}
        }

    for (let i = 0; i < 3; i++) {
        data.json.email = Math.floor(Math.random() * 100000) + '@email.dev'
        data.json.password = Math.floor(Math.random() * 100000).toString()
        data.json.username = 'Username-' + Math.floor(Math.random() * 100000)
        request(data, (err, res, body) => users.push(body.data))
    }

    setTimeout(() => {
        let baseRequest = request.defaults({
            json: true,
            headers: {
                Authorization: users[0].token
            }
        })
        fs.readdirSync(__dirname + '/modules').forEach((name) => {
            require(__dirname + '/modules/' + name)(baseRequest, config, users)
        })
        run()
    }, 1500)

})
