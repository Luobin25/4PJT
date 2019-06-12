module.exports = (app) => {
    let User = require(__dirname + '/../models/user')

    /**
     * @api {get} /users "2.1 Get users"
     *
     * @apiDescription Get all users
     *
     * @apiGroup 2.Users
     * 
     * @apiParam {Authorization} Token     "[Headers] Token generate via login method"
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object} data     "Object user or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": [<user object>,...]
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Request timeout
     *    [{
     *      "success": false,
     *      "data":    "Not found"
     *    }]
     */
    app.get('/users', (req, res) => {
        User.getAll((err, users) => {
            if (err) res.error('Not found', 404)
            else res.success(users)
        })
    })
}