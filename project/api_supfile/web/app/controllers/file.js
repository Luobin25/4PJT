module.exports = (app) => {
    let File = require(__dirname + '/../models/file'),
        User = require(__dirname + '/../models/user'),
        Folder = require(__dirname + '/../models/folder'),
        fs = require('fs')
    let fullPath = ""
    var constructFolderPath = function (object, callback){
        if(object.folder){
            Folder.get(object.folder, (err, folder) => {
                fullPath = folder.name + "/" + fullPath
                if(folder.folder) constructFolderPath(folder, callback)
                else {
                    callback()
                }
            })
        }

    }
    /**
     * @api {get} /file/:id "7.1 Get file"
     * @apiGroup 7.File
     *
     * @apiDescription Get file of user
     *
     * @apiParam {Authorization} Token   "[Headers] Token generate via login method"
     * @apiParam {String}        id      "[GET] File unique ID."
     *
     * @apiSuccess {Boolean} success "Request succeed or not"
     * @apiSuccess {Object}  data    "Array of file or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data":    <File Object>
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Not found
     *    [{
     *      "success": false,
     *      "data":    "Not found"
     *    }]
     */
    app.get('/file/:id', (req, res) => {
        File.get(req.params.id, (err, file) => {
            if (err) res.error('Not found', 404)
            else res.success(file)
        })
    })

    /**
     * @api {put} /file/:id "7.2 Edit file"
     * @apiGroup 7.File
     *
     * @apiDescription Edit file, to ignore a parameter set his value to null
     * 
     * @apiParam {Authorization} Token     "[Headers] Token generate via login method"
     * @apiParam {Number}        id        "[GET] File unique ID."
     * @apiParam {String}        name      "[PUT] name for the file"
     * @apiParam {Number}        folder_id "[PUT] folder ID of parent"
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object} data     "Object user or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": <file object>
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Request timeout
     *    [{
     *      "success": false,
     *      "data":    "Not found"
     *    }]
     */
    app.put('/file/:id', (req, res) => {
        File.edit(req.params.id, req.body.name, req.body.folder_id, (err, file) => {
            if (err) res.error('Not found', 404)
            else res.success(file)
        })
    })

    /**
     * @api {delete} /file/:id "7.3 Delete file"
     * @apiGroup 7.File
     *
     * @apiDescription Delete file of user
     *
     * @apiParam {Authorization} Token   "[Headers] Token generate via login method"
     * @apiParam {Number}        id      "[GET] File unique ID."
     *
     * @apiSuccess {Boolean} success "Request succeed or not"
     * @apiSuccess {Object}  data    "true or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data":    true
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Not found
     *    [{
     *      "success": false,
     *      "data":    "Not found"
     *    }]
     */
    app.delete('/file/:id', (req, res) => {
        File.get(req.params.id, (err, file) => {
            if (!err) {
                fullPath = ""
                if(file.folder) {
                    constructFolderPath(file, ()=> {
                        fs.unlink(req.user.location + fullPath + file.name, (err) => {
                            if (!err) {
                                User.edit(req.user._id, null, null, (req.user.storage_used - (file.size / 1073741824)), null, (err, user) => {
                                    if (!err) File.delete(req.params.id, () => res.success(true))
                                })
                            }
                            else res.error("Not found", 404)
                        })
                    })
                }else{
                    fs.unlink(req.user.location + fullPath + file.name, (err) => {
						if (!err) {
							User.edit(req.user._id, null, null, (req.user.storage_used - (file.size / 1073741824)), null, (err, user) => {
								if (!err) File.delete(req.params.id, () => res.success(true))
							})
						}
						else res.error("Not found", 404)
                    })
                }
            } else res.error("Not found", 404)
        })
    })
}
