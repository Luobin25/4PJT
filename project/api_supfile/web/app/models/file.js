let mongoose = require('mongoose'),
    mkdirp = require('mkdirp')

let File = new mongoose.Schema({
    name: {type: String, required: true},
    mime_type: {type: String, required: false},
    private: {type: Boolean, default: true},
    size: {type: Number},
    owner: {type: mongoose.Schema.ObjectId, ref: 'User'},
    folder: {type: mongoose.Schema.ObjectId, ref: 'Folder', default: null}
})

/**
 * -------------------------------
 *           files.js
 * -------------------------------
 */

File.statics.getAll = function (user_id, cb) {
    this.find({owner: user_id})
        .populate('owner')
        .exec((err, files) => {
            if (err) cb(err)
            else cb(err, files)
        })
}

File.statics.getAllByFolder = function (user_id, folder_id, cb) {
    this.find({owner: user_id, folder: folder_id})
        .populate('owner')
        .exec((err, files) => {
            if (err) cb(err)
            else cb(err, files)
        })
}

/**
 * -------------------------------
 *           file.js
 * -------------------------------
 */

File.statics.get = function (file_id, cb) {
    this.findOne({_id: file_id}, (err, file) => {
        if (err) cb(err)
        else cb(err, file)
    })
}

File.statics.edit = function (file_id, name, parent_id, cb) {
    this.findOne({_id: file_id}, (err, file) => {
        if (err) cb(err)
        else {
            file.name = name === null ? file.name : name
            file.folder = parent_id === null ? file.folder : parent_id
            file.save((err) => cb(err, file))
        }
    })
}

File.statics.delete = function (file_id, cb) {
    this.remove({_id: file_id}, cb)
}

/**
 * -------------------------------
 *           tools.js
 * -------------------------------
 */

File.statics.add = function (filename, folder_id, size, mimetype, user, cb) {
    let file = new this()
    file.folder = folder_id != null ? folder_id : null
    file.name = filename
    file.mime_type = mimetype
    file.private = true
    file.size = size
    file.owner = user._id
    file.save((err) => cb(err, file))
}

File.statics.share = function (file_id, cb) {
    this.findOne({_id: file_id}, (err, file) => {
        if (err) cb(err)
        else {
            file.private = false
            file.save((err) => cb(err, file))
        }
    })
}

File.statics.rename = function (file_id, new_name, cb) {
    this.findOne({_id: file_id}, (err, file) => {
        if (err) cb(err)
        else {
            file.name = new_name
            file.save((err) =>  cb(err, file))
        }
    })
}

File.statics.move = function (file_id, folder_id, cb) {
    this.findOne({_id: file_id}, (err, file) => {
        if (err) cb(err)
        else {
            file.folder = folder_id
            file.save((err) => cb(err, file))
        }
    })
}

module.exports = mongoose.model('File', File)
