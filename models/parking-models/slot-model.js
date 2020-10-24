const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    stack: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLotStack' }],
    
    slot_status_open: {
        type: Boolean,
        default: true
    },
},{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});


module.exports = mongoose.model('Slots', SlotSchema);