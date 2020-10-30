const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcrypt')

const OfficerSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 8, maxlength: 128},
    password_changed_at: { type: Date },
    active: { type: Boolean, default: true },
    push_token: { type: String, default: '' },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' }],
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permissions' }],
    
    archived: { type: Boolean, default: false },
    last_login: { type: Date },

    working_date: {type: Array, required: true},
    works_from: {type: Number, required: true},
    works_to: {type: Number, required: true},

  },{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});

// methods

OfficerSchema.pre('save', function preSave(next) {
    let model = this

    model.hashPasswd(model.password, (err, hash) => {
        model.password = hash
        next()
    })
})


OfficerSchema.method({
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
OfficerSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Officer', OfficerSchema);