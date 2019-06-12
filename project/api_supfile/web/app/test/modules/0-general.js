module.exports = function (request, config) {
    var expect = require('chai').expect,
        user = {};

    describe('General',  () => {
        describe('Sign Up', () => {
            it('Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/signup',
                    method: 'POST',
                    json: {
                        email: Math.floor(Math.random() * 100000) + '@email.dev',
                        password: Math.floor(Math.random() * 100000).toString(),
                        username: 'Username' + Math.floor(Math.random() * 100000)
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.lengthOf(24)
                    expect(body.data.email).to.equal(data.json.email)
                    expect(body.data.username).to.equal(data.json.username)
                    expect(body.data.token).to.be.a('string')
                    user = body.data
                    user.password = data.json.password
                    done()
                })
            })
            it('Status 400', (done) => {
                let data = {
                    url: config.app.domain + '/signup',
                    method: 'POST'
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(400)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Registration failed')
                    done()
                })
            })
        })
        describe('Login', () => {
            it('Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/login',
                    method: 'POST',
                    json: {
                        email: user.email,
                        password: user.password,
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.lengthOf(24)
                    expect(body.data.email).to.equal(user.email)
                    expect(body.data.username).to.equal(user.username)
                    expect(body.data.token).to.be.a('string')
                    done()
                })
            })
            it('Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/login',
                    method: 'POST'
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(404)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Authentication failed, user not found')
                    done()
                })
            })
        })
    })
}
