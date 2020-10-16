const { isArrayBuffer } = require('lodash');
const mongoose = require('mongoose');

const OfficerSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    username: { type: String, default: '' },
    password: { type: String, required: true, minlength: 8, maxlength: 128},
    password_changed_at: { type: Date },
    active: { type: Boolean, default: true },
    push_token: { type: String, default: '' },
    
    archived: { type: Boolean, default: false },
    last_login: { type: Date },

    working_date: {type: Array, required: true},
    works_from: {type: Number, required: true},
    works_to: {type: Number, required: true},

    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Officer', OfficerSchema);