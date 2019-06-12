module.exports = function (request, config, users) {
    var expect = require('chai').expect,
        folder = {};

    describe('Folder',  () => {
        describe('Create', () => {
            it('Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/create/folder/_root',
                    method: 'POST',
                    json: {
                        name: 'rootFolder'
                    }
                };
                request(data, (err,res,body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.length(24)
                    expect(body.data.name).to.equal(data.json.name)
                    folder = body.data
                    done()
                })
            })
			it('Status 200 in sub folder', (done) => {
                let data = {
                    url: config.app.domain + '/create/folder/' + folder._id,
                    method: 'POST',
                    json: {
                        name: 'subFolder'
                    }
                };
                request(data, (err,res,body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.length(24)
                    expect(body.data.name).to.equal(data.json.name)
                    folder = body.data
                    done()
                })
            })
			it('Status 200 in sub sub folder', (done) => {
                let data = {
                    url: config.app.domain + '/create/folder/' + folder._id,
                    method: 'POST',
                    json: {
                        name: 'subSubFolder'
                    }
                };
                request(data, (err,res,body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.length(24)
                    expect(body.data.name).to.equal(data.json.name)
                    folder = body.data
                    done()
                })
            })
			it('Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/create/folder/id',
                    method: 'POST',
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(404)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Not found')
                    done()
                })
            })
        })
        describe('Get', () => {
            it('Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/folder/' + folder._id,
                    method: 'GET',
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.lengthOf(24)
                    expect(body.data.name).to.equal(folder.name)
                    done()
                })
            })
            it('Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/folder/id',
                    method: 'GET',
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
                    url: config.app.domain + '/folder/' + folder._id,
                    method: 'PUT',
                    json: {
                        name: 'renamedSubfolder-' + Math.floor(Math.random() * 100000)
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.lengthOf(24)
                    expect(body.data.name).to.equal(data.json.name)
                    done()
                })
            })
            it('Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/folder/id',
                    method: 'PUT',
                    json: {
                        name: 'testFolder' + Math.floor(Math.random() * 100000)
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(404)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Not found')
                    done()
                })
            })
        })
        describe('Delete', () => {
            it('Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/folder/' + folder._id,
                    method: 'DELETE',
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data).to.equal(true)
                    done()
                })
            })
            it('Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/folder/id',
                    method: 'DELETE',
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(404)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Not found')
                    done()
                })
            })
        })
    })
    describe('Folders',  () => {
        describe('Get Folders', () => {
            it('Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/folders/' + users[0]._id,
                    method: 'GET',
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data).to.be.a('Array')
                    done()
                })
            })
            it('Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/folders/id',
                    method: 'GET',
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(404)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Not found')
                    done()
                })
            })
        })
		describe('Get Folders in Folder', () => {
            it('Status 200: root folder', (done) => {
                let data = {
                    url: config.app.domain + '/folders/' + users[0]._id,
                    method: 'POST',
                    json: {
                        folder_id: '_root'
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data).to.be.a('Array')
                    done()
                })
            })
            it('Status 200: subFolder', (done) => {
                let data = {
                    url: config.app.domain + '/folders/' + users[0]._id,
                    method: 'POST',
                    json: {
                        folder_id: folder._id
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data).to.be.a('Array')
                    done()
                })
            })
            it('Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/folders/' + users[0]._id,
                    method: 'POST',
                    json: {
                        folder_id: 'music'
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(404)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Not found')
                    done()
                })
            })
		})
	})
}