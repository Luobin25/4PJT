let mongoose = require('mongoose'),
    File = require('./file')

let User = new mongoose.Schema({
    email: {type: String, required: true, validate: /\w+@\w+\.\w+/, unique: true, select: true},
    password: {type: String, required: true, select: false},
    username: {type: String, required: true, unique: true},
    storage_max: {type: Number, required: false, unique: false, default:30},
    storage_used: {type: Number, required: false, unique:false, default:0},
    token: {type: String},
    location: {type: String, required: true}
})

/**
 * -------------------------------
 *           general.js
 * -------------------------------
 */

User.statics.setPassword = function (password = '') {
    let bcrypt = require('bcryptjs'),
        salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

User.statics.comparePassword = function (password = '', hash = '') {
    let bcrypt = require('bcryptjs')
    return bcrypt.compareSync(password, hash)
}

User.statics.signUp = function (email, password, username, cb) {
    let user = new this()
    user.email = email
    user.username = username
    user.password = this.setPassword(password)
    user.save((err) => {
        user.location = "/src/app/controllers/../public/files/" + user._id + "/"
        user.save((err) => {
            user.password = undefined
            cb(err, user)
        })
    })
}

User.statics.login = function (email, password, cb) {
    this.findOne({email: email})
        .select('+email')
        .select('+password')
        .exec((err, user) => {
            if (err || !user) cb(err || true)
            else {
                if (!this.comparePassword(password, user.password)) {
                    cb(true)
                } else {
                    user.password = undefined
                    cb(err, user)
                }
            }
        })
}

/**
 * -------------------------------
 *           users.js
 * -------------------------------
 */

User.statics.getAll = function(cb) {
    this.find()
        .exec((err, users) => {
            if (err || !users) cb(err || true)
            else {
                cb(err, users) 
            }
        })
}

/**
 * -------------------------------
 *           user.js
 * -------------------------------
 */

User.statics.get = function (user_id, cb) {
    this.findOne({_id: user_id}, (err, user) => {
        if (err) cb(err)
        else cb(err, user)
    })
}

User.statics.edit = function (user_id, email= null, username= null, storage_used = null, storage_max = null, cb) {
    this.findOne({_id: user_id}, (err, user) => {
        if (err) cb(err, null)
        else {
            user.email = email === null ? user.email : email
            user.username = username === null ? user.username : username
            user.storage_used = storage_used === null ? user.storage_used : storage_used
            user.storage_max = storage_max === null ? user.storage_max : storage_max
            user.save((err) => cb(err, user))
        }
    })
}

User.statics.delete = function(user_id, cb) {
    this.remove({_id: user_id}, cb)
}

module.exports = mongoose.model('User', User)
