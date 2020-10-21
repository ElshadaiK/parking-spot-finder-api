
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcrypt')

const companySchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, unique: true, trim: true, lowercase: true, required: true},
    password: { type: String, required: true, minlength: 8, maxlength: 128},
    password_changed_at: { type: Date },
    active: { type: Boolean, default: true },
    push_token: { type: String, default: '' },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' }],
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permissions' }],
    charge: {type: Number, required: true},
    floor: {type: Number, default: 1},
    slots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slots' }],
    rank: {type: Number, min: 0, max: 5, required: true},
    created_at: { type: Date, default: new Date() },
    opens_at: {type: Number, required: true},
    closes_at: {type: Number, required: true}
})

// methods

companySchema.pre('save', function preSave(next) {
    let model = this

    model.hashPasswd(model.password, (err, hash) => {
        model.password = hash
        next()
    })
})


companySchema.method({
    verifyPassword(passwd) {
        return new Promise((resolve, reject) => {
          bcrypt.compare(passwd, this.password, (err, isMatch) => {
            if (err) {
              return reject(err)
            }
      
            resolve(isMatch)
          })
        })
      },
      hashPasswd(passwd, cb) {
        let createHash = (err, hash) => {
          if (err) {
            return cb(err)
          }
      
          cb(null, hash)
        }
      
        let generateSalt = (err, salt) => {
          if (err) {
            return cb(err)
          }
      
          // Hash the password using the generated salt
          bcrypt.hash(passwd, salt, createHash)
        }
      
        // Generate a salt factor
        bcrypt.genSalt(12, generateSalt) 
      }
})
 

// plugins
companySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Companies', companySchema);
