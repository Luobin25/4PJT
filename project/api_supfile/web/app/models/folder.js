let mongoose = require('mongoose'),
    mkdirp = require('mkdirp')

let Folder = new mongoose.Schema({
    name: {type: String, required: false},
    private: {type: Boolean, default: true},
    owner: {type: mongoose.Schema.ObjectId, ref: 'User'},
    folder: {type: mongoose.Schema.ObjectId, ref: 'Folder', default: null}
})

/**
 * -------------------------------
 *           folders.js
 * -------------------------------
 */

Folder.statics.getAll = function (user_id, cb) {
    this.find({owner: user_id})
        .populate('owner')
        .exec((err, file) => {
            if (err) cb(err)
            else cb(err, file)
        })
}

Folder.statics.getAllByFolder = function (user_id, folder_id, cb) {
    this.find({owner: user_id, folder: folder_id})
        .populate('owner')
        .exec((err, file) => {
            if (err) cb(err)
            else cb(err, file)
        })
}

/**
 * -------------------------------
 *           folder.js
 * -------------------------------
 */

Folder.statics.get = function (folder_id, cb) {
    this.findOne({_id: folder_id}, (err, folder) => {
        if (err) cb(err)
        else cb(err, folder)
    })
}

Folder.statics.edit = function (folder_id, name, parent_id, cb) {
    this.findOne({_id: folder_id}, (err, folder) => {
        if (err) cb(err)
        else {
            folder.name = name === null ? folder.name : name
            folder.folder = parent_id === null ? folder.folder : parent_id
            folder.save((err) => cb(err, folder))
        }
    })
}

Folder.statics.delete = function (folder_id, cb) {
    // TODO: delete also files linked 
    this.remove({_id: folder_id}, cb)
}

/**
 * -------------------------------
 *           tools.js
 * -------------------------------
 */

Folder.statics.add = function (name, user, folder, cb) {
    let nf = new this()
    if (folder != null) nf.folder = folder._id
    nf.name = name
    nf.private = true
    nf.owner = user._id
    nf.save((err) => cb(err, nf))
}

Folder.statics.share = function (folder_id, cb) {
    this.findOne({_id: folder_id}, (err, folder) => {
        if (err) cb(err)
        else {
            folder.private = false
            folder.save((err) => cb(err, folder))
        }
    })
}

Folder.statics.rename = function (folder_id, new_name, cb) {
    this.findOne({_id: folder_id}, (err, folder) => {
        if (err) cb(err)
        else {
            folder.name = new_name
            folder.save((err) =>  cb(err, folder))
        }
    })
}

module.exports = mongoose.model('Folder', Folder)
