module.exports = (app) => {

    let File = require(__dirname + '/../models/file'),
        User = require(__dirname + '/../models/user'),
        Folder = require(__dirname + '/../models/folder'),
        multer = require('multer'),
        fs = require('fs'),
        JSZip = require("jszip"),
        mkdirp = require('mkdirp')

    const {URL} = require('url')

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
    let newPath = ""
    var constructMoveFolderPath = function (object, callback, req, res, parent_folder) {
        if(object.folder){
            Folder.get(object.folder, (err, folder) => {
                newPath = folder.name + "/" + newPath
                if(folder.folder) constructMoveFolderPath(folder, callback, req, res, parent_folder)
        else {

                callback(req, res, parent_folder)
            }
        })
        }else {
            callback(req, res, parent_folder)
        }
    }
    var uploader = function(req, res, parent_folder){
        storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, req.user.location + fullPath)
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
            }
        }), upload = multer({storage: storage}).single('file')

        upload(req, res, function (err) {
            if (!err && req.file) {
                let arr_f_name = req.file.filename.split('/')
                let f_name = arr_f_name[arr_f_name.length - 1]
                File.add(f_name, parent_folder, req.file.size, req.file.mimetype, req.user, (err, file) => {
                    if (!err) {
                        User.edit(req.user._id, null, null, (req.user.storage_used + (req.file.size / 1073741824)), null, (error, user) => {
                            if (!error) res.success(file)
                            else res.error('Database saving failed', 400)
                        })
                    }else res.error('Database saving failed', 400)
                })
            }
            else res.error('Error during upload process', 404)
        })
    }

    /**
     * @api {post} /create/file/:folder_id "8.1 Upload file"
     * @apiGroup 8.Tools
     *
     * @apiDescription Upload a file in a directory \
     * If you want to upload the file in the root directory, set "_root" for the folder_id parameter
     *
     * @apiParam {Authorization} Token      "[Headers] Token generate via login method"
     * @apiParam {Number}        folder_id  "[GET] Folder unique ID or _root"
     * @apiParam {File}          file       "[POST] File."
     *
     * @apiSuccess {Boolean} success "Request succeed or not"
     * @apiSuccess {Object}  data    "File or error message"
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
    app.post('/create/file/:folder_id', (req, res) => {
        let storage = null
        let f = null
        if(req.params.folder_id != '_root') {
            // Upload inside a folder
            Folder.get(req.params.folder_id, (err, folder) => {
                if (err) res.error('Not found', 404)
                else {
                    fullPath = folder.name + "/"
                    if (folder.folder) constructFolderPath(folder, uploader, req, res, folder)
                    else uploader(req, res, folder._id)
                }
            })
        }else{
            fullPath = ""
            // Upload in root folder
            uploader(req, res, null)
        }
    })

    /**
     * @api {post} /create/folder/:folder_id "8.2 Create folder"
     * @apiGroup 8.Tools
     *
     * @apiDescription Create a folder in a directory \
     * If you want to create the folder in the root directory, set "_root" for the folder_id parameter
     *
     * @apiParam {Authorization} Token      "[Headers] Token generate via login method"
     * @apiParam {Number}        folder_id  "[GET] Folder unique ID or _root"
     * @apiParam {String}        name       "[POST] Folder name."
     *
     * @apiSuccess {Boolean} success "Request succeed or not"
     * @apiSuccess {Object}  data    "File or error message"
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
    app.post('/create/folder/:folder_id', (req, res) => {
        if(req.params.folder_id != '_root') {
            // Create inside a folder
            Folder.get(req.params.folder_id, (err, folder) => {
                if (err) res.error('Not found', 404)
                else {
                    if (folder.folder) {
                        fullPath = folder.name + "/"
                        constructFolderPath(folder, () => {
                            mkdirp(req.user.location + fullPath + req.body.name, function(err) {
                                Folder.add(req.body.name, req.user, folder, (err, folder) => {
                                    if (!err) res.success(folder)
                                    else res.error("Error during folder creation", 400)
                                })
                            })
                        })
                    }else{
                        mkdirp(req.user.location + folder.name + "/" + req.body.name, function(err) {
                            Folder.add(req.body.name, req.user, folder, (err, folder) => {
                                if (!err) res.success(folder)
                                else res.error("Error during folder creation", 400)
                            })
                        })
                    }
                }
            })
        }else{
            // Create in root folder
            mkdirp(req.user.location + req.body.name, function(err) {
                Folder.add(req.body.name, req.user, null, (err, folder) => {
                    if (!err) res.success(folder)
                    else res.error("Error during folder creation", 400)
                })
            })
        }
    })

    /**
     * @api {get} /share/:resource/:id "8.3 Share file/folder"
     * @apiGroup 8.Tools
     *
     * @apiDescription Set property private to false. \
     * Be careful if you use this method on a folder, all file inside will be shared too but not the subfolder.
     *
     * @apiParam {Authorization} Token    "[Headers] Token generate via login method"
     * @apiParam {String}        resource "[GET] file or folder."
     * @apiParam {Number}        id_file  "[GET] File unique ID."
     *
     * @apiSuccess {Boolean} success "Request succeed or not"
     * @apiSuccess {Object}  data    "Link or error message"
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
    app.get('/share/:resource/:id', (req, res) => {
        if(req.params.resource == "file") {
            File.share(req.params.id, (err, file) => {
                if (err) res.error('Not found', 404)
                else res.success(true)
            })
        }
        if(req.params.resource == "folder") {
            Folder.share(req.params.id, (err, folder) => {
                if (err) res.error('Not found', 404)
                else {
                    File.getAllByFolder(req.user._id, folder._id, (err, files) => {
                        if (err) res.error('Error retriving files', 404)
                        else {
                            files.forEach((item) => {
                                File.share(item._id, (err, file) => {
                                    if (err) res.error('Not found', 404)
                                })
                            })
                            res.success(true)
                        }
                    })
                }
            })
        }
        
    })

    /**
     * @api {get} /download/:id "8.4 Download file"
     * @apiGroup 8.Tools
     *
     * @apiDescription Download a file
     *
     * @apiParam {Authorization} Token   "[Headers] Token generate via login method"
     * @apiParam {Number}        id      "[GET] File unique ID."
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
     *      "data":    "Not found"
     *    }]
     */
    app.get('/download/:id', (req, res) => {
        File.get(req.params.id, (err, file) => {
            if (!err) {
                if (req.user._id == file.owner || file.private === false) {
                    if (file.folder) {
                        fullPath = ""
                        constructFolderPath(file, () => {
                            res.download(req.user.location + fullPath + file.name, file.name)
                        })
                    }else{
                        res.download(req.user.location + file.name, file.name)
                    }
                } else res.error("It's not your file or it's not shared", 400)
            } else res.error("Not found", 404)
        })
    })

    /**
     * @api {post} /rename/:resource/:id "8.5 Rename file/folder"
     * @apiGroup 8.Tools
     *
     * @apiDescription Rename the file/folder
     *
     * @apiParam {Authorization} Token    "[Headers] Token generate via login method"
     * @apiParam {Number}        resource "[GET] file or folder."
     * @apiParam {Number}        id       "[GET] Resource unique ID."
     * @apiParam {String}        new_name "[POST] New name."
     *
     * @apiSuccess {Boolean} success "Request succeed or not"
     * @apiSuccess {Object}  data    "File or error message"
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
    app.post('/rename/:resource/:id', (req, res) => {
        if(req.params.resource == "file") {
            File.get(req.params.id, (err, file) => {
                if (!err) {
                    if (file.folder) {
                        fullPath = ""
                        constructFolderPath(file, () => {
                            fsRenamer(res, req.params.resource, req.params.id, req.body.new_name, req.user.location + fullPath + file.name, req.user.location + fullPath + req.body.new_name)
                        })
                    }else{
                        fsRenamer(res, req.params.resource, req.params.id, req.body.new_name, req.user.location + file.name, req.user.location + req.body.new_name)
                    }
                } else res.error("Not found", 404)
            })
        }
        if (req.params.resource == "folder") {
            Folder.get(req.params.id, (err, folder) => {
                if (!err) {
                    if (folder.folder) {
                        fullPath = folder.name
                        constructFolderPath(folder, () => {
                            fsRenamer(res, req.params.resource, req.params.id, req.body.new_name, req.user.location + fullPath, req.user.location + fullPath + req.body.new_name)
                        })
                    }else{
                        fsRenamer(res, req.params.resource, req.params.id, req.body.new_name, req.user.location + folder.name, req.user.location + req.body.new_name)
                    }
                } else res.error("Not found", 404)
            })
        }
    })

    function fsRenamer(res, type, id, new_name, old_path, new_path) {
        fs.rename(old_path, new_path, (err) => {
            if (!err) {
                if(type == "file"){
                    File.rename(id, new_name, (err, file) => {
                        if (!err) res.success(file)
                        else res.error('Database saved failed', 500)
                    })
                }
                if(type == "folder") {
                    Folder.rename(id, new_name, (err, folder) => {
                        if (!err) res.success(folder)
                        else res.error('Database saved failed', 500)
                    })
                }
            } else res.error("Failed", 400)
        })
    }

    /**
     * @api {post} /move/:resource/:id "8.6 Move file/folder"
     * @apiGroup 8.Tools
     *
     * @apiDescription Move the file/folder
     *
     * @apiParam {Authorization} Token     "[Headers] Token generate via login method"
     * @apiParam {Number}        resource  "[GET] file or folder."
     * @apiParam {Number}        id        "[GET] Resource unique ID."
     * @apiParam {String}        folder_id "[POST] Folder unique ID or _root."
     *
     * @apiSuccess {Boolean} success "Request succeed or not"
     * @apiSuccess {Object}  data    "File or error message"
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
    app.post('/move/:resource/:id', (req, res) => {
        if(req.params.resource == "file") {
            File.get(req.params.id, (err, file) => {
                if (!err) {
                    if (file.folder) {
                        fullPath = ""
                        constructFolderPath(file, () => {
                            let old_path = req.user.location + fullPath + file.name
                            constructNewPathAndMove(res, req.params.resource, req.params.id, req.body.folder_id, old_path, req.user.location, file.name,req)
                        })
                    }else{
                        let old_path = req.user.location + file.name
                        constructNewPathAndMove(res, req.params.resource, req.params.id, req.body.folder_id, old_path, req.user.location, file.name,req)
                    }
                } else res.error("Not found", 404)
            })
        }
        if (req.params.resource == "folder") {
            // TODO: next version
        }
    })

    function constructNewPathAndMove(res, type, id_resource, id_folder, old_path, user_location, filename,req) {
        newPath = "";
        if(id_folder == '_root'){
            fsMove(res, type, id_resource, null, old_path, req.user.location + filename)
        }else{
            Folder.get(id_folder, (err, folder) => {
                if(folder.folder) {
                newPath = folder.name + "/"
                }
                constructMoveFolderPath(folder, () => {
                    if(newPath == ''){
                        newPath = folder.name + '/';
                    }
                    let new_path = user_location + newPath + filename
                    fsMove(res, type, id_resource, id_folder, old_path, new_path)
                })
            })
        }
    }

    function fsMove(res, type, id, new_parent, old_path, new_path) {
        // According to FS documentation, we use fs.rename to move a file
        fs.rename(old_path, new_path, (err) => {
            if (!err) {
                if(type == "file"){
                    File.move(id, new_parent, (err, file) => {
                        if (!err) res.success(file)
                        else res.error('Database saved failed', 500)
                    })
                }
                if(type == "folder") {
                    // TODO: next version
                }
            } else res.error("Failed", 400)
        })
    }

    /**
     * @api {post} /zip "8.7 Zip file(s) of user"
     * @apiGroup 8.Tools
     *
     * @apiDescription Zip the file/folder into the directory of the file/folder
     *
     * @apiParam {Authorization} Token        "[Headers] Token generate via login method"
     * @apiParam {String}        path         "[POST] path of file/folder that will be zipped."
     * @apiParam {String}        archive_name "[POST] name of the archive."
     * @apiParam {String}        type         "[POST] "folder" or "file""
     * @apiParam {String}        [filename]   "[POST] if type "file", fill the name of the file"
     *
     * @apiSuccess {Boolean} success "Request succeed or not"
     * @apiSuccess {Object}  data    "File object or error message"
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
    /**
    app.post('/zip', (req, res) => {
        let zip = new JSZip()
        let str_stream_writer = ""
        if (req.body.type === "file") {
            str_stream_writer = req.body.path.substring(0, req.body.path.length - req.body.filename.length)
            zip.file(req.body.filename, fs.readFileSync(new URL('file://' + req.body.path)))
        } else if (req.body.type === "folder") {
            str_stream_writer = req.body.path
            let tmp = req.body.path.split('/')
            zipFolderize(req.body.path, tmp[tmp.length - 1], zip)
        }
        zip.generateNodeStream({type: 'nodebuffer', streamFiles: true})
            .pipe(fs.createWriteStream(str_stream_writer + req.body.archive_name))
            .on('finish', () => {
                File.add(req.body.archive_name, req.body.path, "", getFilesizeInBytes(str_stream_writer+req.body.archive_name), "application/x-zip-compressed", req.user, (err, file) => {
                    if (!err) {
                        User.get(file.owner, (err, user) => {
                            User.edit(user._id, null, null, (user.storage_used + (file.size / 1073741824)), null, (err, user) => {
                                if (!err) res.success(file)
                            })
                        })
                    }
                    else res.error('Database saving failed', 400)
                })
            })
            .on('error', () => res.error('Not found', 404))
    })

    function zipFolderize(path, path_relational, zipObject) {
        let f = zipObject.folder(path_relational)
        let filenames = fs.readdirSync(path)
        filenames.forEach((item) => {
            let actual_path = path + item
            let folder_path = ""
            if (fs.lstatSync(path + item).isDirectory()) {
                if (fs.readdirSync(path + item + '/').length === 0) {
                    fs.rmdirSync(path + item + '/')
                    return
                }
                folder_path = path + item
                zipFolderize(path + item + '/', path_relational += item + '/', zipObject)
            }
            if (actual_path === folder_path) return
            f.file(item, fs.readFileSync(new URL('file://' + path + item)))
        })
    }

    function getFilesizeInBytes(filename) {
        const stats = fs.statSync(filename)
        return stats.size
    }
    */

}