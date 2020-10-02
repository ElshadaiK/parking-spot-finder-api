const mongoose = require('mongoose');

const OfficerSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    username: { type: String, default: '' },
    password: { type: String, required: true, minlength: 8, maxlength: 128},
    password_changed_at: { type: Date },
    active: { type: Boolean, default: true },
    push_token: { type: String, default: '' },
    company: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Companies' }],
    
    archived: { type: Boolean, default: false },
    last_login: { type: Date },

    working_date: {type: Date, required: true},
    works_from: {type: Date, required: true},
    works_to: {type: Date, required: true},

    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Slots', OfficerSchema);