module.exports = (app) => {
    let Folder = require(__dirname + '/../models/folder')

    /**
     * @api {get} /folder/:id "5.1 Get folder"
     *
     * @apiDescription Get folder
     * @apiGroup 5.Folder
     * 
     * @apiParam {Authorization} Token     "[Headers] Token generate via login method"
     * @apiParam {Number}        id        "[GET] Folder unique ID."
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object} data     "Object user or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": <folder object>
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Request timeout
     *    [{
     *      "success": false,
     *      "data":    "Not found"
     *    }]
     */
    app.get('/folder/:id', (req, res) => {
        Folder.get(req.params.id, (err, folder) => {
            if (err) res.error('Not found', 404)
            else res.success(folder)
        })
    })

    /**
     * @api {put} /folder/:id "5.2 Edit folder"
     *
     * @apiDescription Edit folder, to ignore a parameter set his value to null
     * @apiGroup 5.Folder
     * 
     * @apiParam {Authorization} Token     "[Headers] Token generate via login method"
     * @apiParam {Number}        id        "[GET] Folder unique ID."
     * @apiParam {String}        name      "[PUT] name for the folder"
     * @apiParam {Number}        folder_id "[PUT] folder ID of parent"
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object} data     "Object user or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": <folder object>
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Request timeout
     *    [{
     *      "success": false,
     *      "data":    "Not found"
     *    }]
     */
    app.put('/folder/:id', (req, res) => {
        Folder.edit(req.params.id, req.body.name, req.body.folder_id, (err, folder) => {
            if (err) res.error('Not found', 404)
            else res.success(folder)
        })
    })

    /**
     * @api {delete} /folder/:id "5.3 Delete folder"
     *
     * @apiDescription Delete folder, be carreful ! This will also delete all files linked.
     * @apiGroup 5.Folder
     * 
     * @apiParam {Authorization} Token     "[Headers] Token generate via login method"
     * @apiParam {Number}        id        "[GET] Folder unique ID."
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object} data     "Object user or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": true
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Request timeout
     *    [{
     *      "success": false,
     *      "data":    "Not found"
     *    }]
     */
    app.delete('/folder/:id', (req, res) => {
        Folder.delete(req.params.id, (err) => {
            if (err) res.error('Not found', 404)
            else res.success(true)
        })
    })
}