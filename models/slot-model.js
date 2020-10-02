const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    flag: {type: Boolean, default: false}
});

module.exports = mongoose.model('Slots', SlotSchema);