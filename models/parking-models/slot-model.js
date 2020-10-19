const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    
    rank: {
        type: Number,
        min: 0
    },

    parking_lot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingLot'
    },

    slot_size_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SlotSize'
    },
    
    slot_status_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SlotStatus'
    },

});

module.exports = mongoose.model('Slots', SlotSchema);