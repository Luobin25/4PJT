module.exports = function (request, config, users) {
    var expect = require('chai').expect,
        file = {},
        folder = {},
        fs = require('fs');

    describe('Tools', () => {
        describe('Resources Creation', () => {
            it('File: Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/create/file/_root',
                    method: 'POST',
                    formData: {
                        file: fs.createReadStream(__dirname + '/../medias/zipFolder/text.txt')
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
            it('File: Status 404', (done) => {
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
            it('Folder: Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/create/folder/_root',
                    method: 'POST',
                    json: {
                        name: 'folderToolsTest-' + Math.floor(Math.random() * 100000)
                    }
                };
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.length(24)
                    expect(body.data.name).to.equal(data.json.name)
                    folder = body.data
                    done()
                })
            })
            it('Folder: Status 404', (done) => {
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
        describe('Share', () => {
            it('File: Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/share/file/' + file._id,
                    method: 'GET',
                };
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data).to.equal(true)
                    done()
                })
            })
            it('File: Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/share/file/id',
                    method: 'GET',
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(404)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Not found')
                    done()
                })
            })
            it('Folder: Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/share/folder/' + folder._id,
                    method: 'GET',
                };
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data).to.equal(true)
                    done()
                })
            })
            it('Folder: Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/share/folder/id',
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
        describe('Download', () => {
            it('File: Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/download/' + file._id,
                    method: 'GET'
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    done()
                })
            })
            it('File: Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/download/id',
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
        describe('Rename', () => {
            it('File: Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/rename/file/' + file._id,
                    method: 'POST',
                    json: {
                        new_name: "renamed_text.txt"
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.length(24)
                    expect(body.data.name).to.equal(data.json.new_name)
                    done()
                })
            })
            it('File: Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/rename/file/id',
                    method: 'POST'
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(404)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Not found')
                    done()
                })
            })
            it('Folder: Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/rename/folder/' + folder._id,
                    method: 'POST',
                    json: {
                        new_name: "renamed_folder"
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data._id).to.have.length(24)
                    expect(body.data.name).to.equal(data.json.new_name)
                    done()
                })
            })
            it('Folder: Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/rename/folder/id',
                    method: 'POST',
                    json: {
                        new_name: "notfound"
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
        describe('Move', () => {
            it('File: Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/move/file/' + file._id,
                    method: 'POST',
                    json: {
                        folder_id: folder._id,
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    done()
                })
            })
            it('File: Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/move/file/id',
                    method: 'POST',
                    json: {
                        folder_id: folder._id,
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
        /**
        describe('Zip', () => {
            it('File: Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/zip',
                    method: 'POST',
                    json: {
                        path: '/src/app/test/medias/zipFolder/text.txt',
                        archive_name: "zip_file.zip",
                        type: "file",
                        filename: "text.txt"
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    expect(body.data.name).to.be.equal(data.json.archive_name)
                    done()
                })
            })
            it('File: Status 404', (done) => {
                let data = {
                    url: config.app.domain + '/zip',
                    method: 'POST',
                    json: {
                        path: '/src/app/test/medias/text.txt',
                        archive_name: "zip_file.zip",
                        type: "file",
                        filename: "text.txt"
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(404)
                    expect(body.success).to.equal(false)
                    expect(body.data).to.equal('Not found')
                    done()
                })
            })
            it('Folder: Status 200', (done) => {
                let data = {
                    url: config.app.domain + '/zip',
                    method: 'POST',
                    json: {
                        path: '/src/app/test/medias/',
                        archive_name: "zip_folder.zip",
                        type: "folder"
                    }
                }
                request(data, (err, res, body) => {
                    expect(res.statusCode).to.equal(200)
                    expect(body.success).to.equal(true)
                    done()
                })
            })    
        })
        */
    })
}