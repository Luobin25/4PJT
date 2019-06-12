module.exports = (app) => {
    let User = require(__dirname + '/../models/user'),
        File = require(__dirname + '/../models/file'),
        Folder = require(__dirname + '/../models/folder')   

    /**
     * @api {get} /helloworld "1.1 Hello World"
     * @apiDescription Prove all work fine.
     * @apiGroup 1.General
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {String}  message "Hello world !"
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "message": "Hello world !"
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 500 Internal Server Error
     */
    app.get('/helloworld', (req, res)=> {
        res.status(200).json({"success": true, "message": "Hello world !"})
    })

    /**
     * @api {post} /signup "1.2 Signup"
     *
     * @apiDescription Create account to the api ang retrieve a token. \
     * Once account created no need to login after. \
     * Save in the browser cookie/ localStorage the token.
     *
     * @apiGroup 1.General
     *
     * @apiParam {String} email    "[POST] User email."
     * @apiParam {String} username "[POST] User username."
     * @apiParam {String} password "[POST] User password."
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object} data     "Object user or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": {
     *          id:       <string>
     *          email:    <email>
     *          username: <string>
     *          token:    <string>
     *      }
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 400 Request timeout
     *    [{
     *      "success": false,
     *      "data":    "Registration failed"
     *    }]
     */
    app.post('/signup', (req, res) => {
        User.signUp(req.body.email, req.body.password, req.body.username, (err, user) => {
            if (err) res.error('Registration failed')
            else {
                user.token = res.sign(user)
                res.success(user)
            }
        })
    })

    /**
     * @api {post} /login "1.3 Login"
     *
     * @apiDescription Log the user with email and password\
     * Retrieve the token to continue using this API
     *
     * @apiGroup 1.General
     *
     * @apiParam {String} email    "[POST] User email."
     * @apiParam {String} password "[POST] User password."
     *
     * @apiSuccess {Boolean} success "Request succeed"
     * @apiSuccess {Object} data     "Object user or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data": {
     *          id:       <string>
     *          email:    <email>
     *          username: <string>
     *          token:    <string>
     *      }
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Not found
     *    [{
     *      "success": false,
     *      "data":    "Authentication failed, user not found"
     *    }]
     */
    app.post('/login', (req, res) => {
        User.login(req.body.email, req.body.password, (err, user) => {
            if (err) res.error('Authentication failed, user not found',404);
            else {
                user.token = res.sign(user)
                res.success(user)
            }
        })
    })

    /**
     * @api {get} /p/download/:id_file/:id_user "1.4 Download public file"
     * @apiGroup 1.General
     *
     * @apiDescription Download a public file by providing the file id and the id of the owner.
     *
     * @apiParam {Number}        id_file      "[GET] File unique ID."
     * @apiParam {Number}        id_user      "[GET] User unique ID of owner."
     *
     * @apiSuccess {Boolean} success "Request succeed or not"
     * @apiSuccess {Object}  data    "File or error message"
     *
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    [{
     *      "success": true,
     *      "data":    <file>
     *    }]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 404 Not found
     *    [{
     *      "success": false,
     *      "data":    "Not found" or "This file is not shared"
     *    }]
     */
    app.get('/p/download/:id_file/:id_user', (req, res) => {
        User.get(req.params.id_user, (err, user) => {
            File.get(req.params.id_file, (err, file) => {
                if (!err) {
                    if (req.params.id_user.toString() == file.owner.toString() || file.private === false) {
                        if (file.folder) {
                            fullPath = ""
                            constructFolderPath(file, () => {
                                res.download(user.location + fullPath + file.name, file.name)
                            })
                        }else{
                            res.download(user.location + file.name, file.name)
                        }
                    } else res.error("This file is not shared", 400)
                } else res.error("Not found", 404)
            })
        })
    })

    let fullPath = ""
    var constructFolderPath = function (object, callback, req, res, parent_folder) {
        if(object.folder){
            Folder.get(object.folder, (err, folder) => {
                fullPath = folder.name + "/" + fullPath
                if(folder.folder) constructFolderPath(folder, callback, req, res, parent_folder)
                else {
                    callback(req, res, parent_folder)
                }
            })
        }else {
            callback(req, res, parent_folder)
        }
    }

}
