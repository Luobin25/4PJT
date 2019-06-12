module.exports = (app) => {
    let Folder = require(__dirname + '/../models/folder')

    /**
     * @api {get} /folders/:id "4.1 Get folders of user"
     *
     * @apiDescription Get all folders of user
     * @apiGroup 4.Folders
     * 
     * @apiParam {Authorization} Token     "[Headers] Token generate via login method"
     * @apiParam {Number}        id        "[GET] User unique ID."
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object} data     "Object user or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": [<folder object>,...]
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Request timeout
     *    [{
     *      "success": false,
     *      "data":    "Not found"
     *    }]
     */
    app.get('/folders/:id', (req, res) => {
        Folder.getAll(req.params.id, (err, folders) => {
            if (err) res.error('Not found', 404)
            else res.success(folders)
        })
    })

    /**
     * @api {post} /folders/:id "4.2 Get folders of user in folder"
     *
     * @apiDescription Get all folders inside a folder, to get just folders of root folder\
     *  put "_root" for the folder post parameter
     * @apiGroup 4.Folders
     * 
     * @apiParam {Authorization} Token     "[Headers] Token generate via login method"
     * @apiParam {Number}        id        "[GET] User unique ID."
     * @apiParam {String}        folder_id "[POST] Folder unique ID or '_root'."
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object} data     "Object user or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": [<folder object>,...]
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Request timeout
     *    [{
     *      "success": false,
     *      "data":    "Not found"
     *    }]
     */
    app.post('/folders/:id', (req, res) => {
        if(req.body.folder_id == "_root"){
            Folder.getAllByFolder(req.params.id, null, (err, folders) => {
                if (err) res.error('Not found', 404)
                else res.success(folders)
            })
        }else{
            Folder.getAllByFolder(req.params.id, req.body.folder_id, (err, folders) => {
                if (err) res.error('Not found', 404)
                else res.success(folders)
            })
        }
    })
}