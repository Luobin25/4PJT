module.exports = (app) => {
    let File = require(__dirname + '/../models/file')

    /**
     * @api {get} /files/:id "6.1 Get files of user"
     *
     * @apiDescription Get all folders of user
     * @apiGroup 6.Files
     * 
     * @apiParam {Authorization} Token     "[Headers] Token generate via login method"
     * @apiParam {Number}        id        "[GET] User unique ID."
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object} data     "Object file or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": [<file object>,...]
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Request timeout
     *    [{
     *      "success": false,
     *      "data":    "Not found"
     *    }]
     */
    app.get('/files/:id', (req, res) => {
        File.getAll(req.params.id, (err, files) => {
            if (err) res.error('Not found', 404)
            else res.success(files)
        })
    })

    /**
     * @api {post} /files/:id "6.2 Get files of user in folder"
     *
     * @apiDescription Get all folders inside a folder, to get just files of root folder\
     *  put "_root" for the folder post parameter
     * @apiGroup 6.Files
     * 
     * @apiParam {Authorization} Token     "[Headers] Token generate via login method"
     * @apiParam {Number}        id        "[GET] User unique ID."
     * @apiParam {String}        folder_id "[POST] Folder unique ID."
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object} data     "Object file or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": [<file object>,...]
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Request timeout
     *    [{
     *      "success": false,
     *      "data":    "Not found"
     *    }]
     */
    app.post('/files/:id', (req, res) => {
        if(req.body.folder_id == "_root"){
            File.getAllByFolder(req.params.id, null, (err, files) => {
                if (err) res.error('Not found', 404)
                else res.success(files)
            })
        }else{
            File.getAllByFolder(req.params.id, req.body.folder_id, (err, files) => {
                if (err) res.error('Not found', 404)
                else res.success(files)
            })
        }
    })
}