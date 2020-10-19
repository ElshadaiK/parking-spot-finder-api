const mongoose = require('mongoose');

const ParkingLotStack = new mongoose.Schema({

  parking_lot_id: {type: Number},

  parking_lot_rank: {type: Number},

  slot_size_id: {type: Number},

  data: {type: String},

  created_at: {
    type: Date,
    default: Date.NOW
  },
  updated_at: {
    type: Date,
    default: Date.NOW
  }
});

module.exports = mongoose.model('ParkingLotStack', ParkingLotStack);
