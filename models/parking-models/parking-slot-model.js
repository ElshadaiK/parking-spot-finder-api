const mongoose = require('mongoose');

const ParkingSlot = new mongoose.Schema({

  stack: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLotStack' }],
  status: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlotStatus' }],

},{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});


module.exports = mongoose.model('ParkingSlot', ParkingSlot);
