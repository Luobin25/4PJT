module.exports = (app) => {

    let User = require(__dirname + '/../models/user')

    /**
     * @api {get} /user/:id "3.1 Get user"
     * @apiGroup 3.User
     *
     * @apiDescription Retrieve id, email and password from a user
     *
     * @apiParam {Authorization} Token "[Headers] Token generate via login method"
     * @apiParam {Number}        id    "[GET] User unique ID."
     *
     * @apiSuccess {Boolean} success "Request succeed or not"
     * @apiSuccess {Object}  data    "Object user or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": {
     *          "id":           <string>
     *          "email":        <email>
     *          "username":     <string>
     *          "storage_max":  <string>
     *          "storage_used": <string>
     *      }
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Not found
     *    [{
     *      "success": false,
     *      "data":    "Not found"
     *    }]
     */
    app.get('/user/:id', (req, res) => {
        User.get(req.params.id, (err, user) => {
            if (err) res.error('Not found', 404)
            else res.success(user)
        })
    })

    /**
     * @api {put} /user/:id "3.2 Edit user"
     * @apiGroup 3.User
     *
     * @apiDescription Edit user, you need to send email and username even if only the email or username will be modified
     *
     * @apiParam {Authorization} Token        "[Headers] Token generate via login method"
     * @apiParam {Number}        id           "[GET] User unique ID."
     * @apiParam {String}        email        "[PUT] User email."
     * @apiParam {String}        username     "[PUT] User username."
     * @apiParam {String}        storage_max  "[PUT] Max storage for this user."
     * @apiParam {String}        storage_used "[PUT] Current used storage."
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object}  data    "Object user or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": <user>
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 400 Request timeout
     *    [{
     *      "success": false,
     *      "data": "User edit failed"
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 403 Forbidden
     *    [{
     *      "success": false,
     *      "data": "Forbidden"
     *    }]
     */
    app.put('/user/:id', (req, res) => {
        if (req.params.id === req.user._id) {
            User.edit(req.params.id, req.body.email, req.body.username, req.body.storage_used, req.body.storage_max, (err, user) => {
                if (err) res.error('User edit failed', 400)
                else res.success(user)
            })
        } else res.error('Forbidden', 403)
    })

    /**
     * @api {delete} /user/:id "3.3 Delete user"
     * @apiGroup 3.User
     *
     * @apiDescription Remove user
     *
     * @apiParam {Authorization} Token        "[Headers] Token generate via login method"
     * @apiParam {Number}        id           "[GET] User unique ID."
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object}  data    "Object user or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": true
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 400 Request timeout
     *    [{
     *      "success": false,
     *      "data": "Remove user failed"
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 403 Forbidden
     *    [{
     *      "success": false,
     *      "data": "Forbidden"
     *    }]
     */
    app.delete('/user/:id', (req, res) => {
        User.delete(req.params.id, (err) => {
            if (err) res.error('Remove user failed', 400)
            else res.success(true)
        })
    })
}
