const mongoose = require('mongoose');

const ParkingSlot = new mongoose.Schema({

  stack: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLotStack' },
  status: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlotStatus' }],
  occupied_by : { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },

},{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});


module.exports = mongoose.model('ParkingSlot', ParkingSlot);
