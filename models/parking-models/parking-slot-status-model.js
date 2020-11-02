const mongoose = require('mongoose');

const ParkingSlotStatus = new mongoose.Schema({

  status: [{ type: String}],

},{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});


module.exports = mongoose.model('ParkingSlotStatus', ParkingSlotStatus);
