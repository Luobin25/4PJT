module.exports = (request, config, users) => {

    let expect = require('chai').expect,
        user = {}

    describe('User', () => {
        describe('Get', () => {
            it('Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/user/' + users[0]._id,
                    method: 'GET'
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.lengthOf(24)
                    expect(body.data.username).to.equal(users[0].username)
                    done()
                })
            })
            it('Status 404', (done) =>{
                let data = {
                    url: config.app.domain + '/user/id',
                    method: 'GET'
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(404)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Not found')
                    done()
                })
            })
		})
		describe('Edit', () => {
            it('Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/user/' + users[0]._id,
                    method: 'PUT',
                    json: {
                        email: Math.floor(Math.random() * 100000) + '@email.dev',
                        username: 'Username' + Math.floor(Math.random() * 100000)
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.lengthOf(24)
                    expect(body.data.email).to.equal(data.json.email)
                    expect(body.data.username).to.equal(data.json.username)
                    user = body.data
                    done()
                })
            })
            it('Status 403', (done) =>{
                let data = {
                    url: config.app.domain + '/user/' + users[1]._id,
                    method: 'PUT',
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(403)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Forbidden')
                    done()
                })
            })
		})
		describe('Delete', () => {
            it('Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/user/' + users[1]._id,
                    method: 'DELETE',
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data).to.equal(true)
                    done()
                })
            })
            it('Status 403', (done) =>{
                let data = {
                    url: config.app.domain + '/user/id',
                    method: 'DELETE',
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(400)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Remove user failed')
                    done()
                })
            })
		})
    })
    describe('Users',  () => {
        describe('Get Users', () => {
            it('Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/users',
                    method: 'GET',
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data).to.be.a('Array')
                    done()
                })
            })
        })
    })
}
            