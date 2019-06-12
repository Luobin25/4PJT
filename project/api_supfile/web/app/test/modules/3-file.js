module.exports = function (request, config, users) {

    let expect = require('chai').expect,
        file = {},
        fileToDelete = {},
        folder = {},
        fs = require('fs')

    describe('File', () => {
        describe('Create', () => {
            it('Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/create/file/_root',
                    method: 'POST',
                    formData: {
                        file: fs.createReadStream(__dirname + '/../medias/picture.png')
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data.folder).to.equal(null)
                    file = body.data;
                    done()
                })
            })
            it('Status 200 in subfolder', (done) => {
                let data = {
                    url: config.app.domain + '/create/folder/_root',
                    method: 'POST',
                    json: {
                        name: 'folderFileTest'
                    }
                };
                let fsData = {
                    method: 'POST',
                    formData: {
                        file: fs.createReadStream(__dirname + '/../medias/picture.png')
                    }
                };
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data.name).to.equal(data.json.name)
                    folder = body.data
                    fsData.url = config.app.domain + '/create/file/' + body.data._id
                    request(fsData, (err, res, body) => {
                        expect(res.statusCode).to.equal(200)
                        expect(body.success).to.equal(true)
                        fileToDelete = body.data
                        done()
                    })
                })
            })
            it('Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/create/file/id',
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
                    url: config.app.domain + '/file/' + file._id,
                    method: 'GET'
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.lengthOf(24)
                    done()
                })
            })
            it('Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/file/id',
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
                    url: config.app.domain + '/file/' + file._id,
                    method: 'PUT',
                    json: {
                        name: 'renamed_picture.png',
                        folder_id: null
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
                    url: config.app.domain + '/file/id',
                    method: 'PUT',
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
                    url: config.app.domain + '/file/' + fileToDelete._id,
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
                    url: config.app.domain + '/file/id',
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
    describe('Files', () => {
        describe('Get Files', () => {
            it('Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/files/' + users[0]._id,
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
                    url: config.app.domain + '/files/id',
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
        describe('Get Files in Folder', () => {
            it('Status 200: root folder', (done) => {
                let data = {
                    url: config.app.domain + '/files/' + users[0]._id,
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
                    url: config.app.domain + '/files/' + users[0]._id,
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
                    url: config.app.domain + '/files/' + users[0]._id,
                    method: 'POST',
                    json: {
                        folder_id: 'undefined'
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