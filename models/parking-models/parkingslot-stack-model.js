const mongoose = require('mongoose');

const ParkingLotStack = new mongoose.Schema({

  company: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Companies' }],

  parking_slots : {type: Number},
  
  floor : {type: Number, default: 1},

  parking_lot_rank: {type: Number},

  full_status : {type: Boolean, default: false}, 

  data: {type: String},

},{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});

module.exports = mongoose.model('ParkingLotStack', ParkingLotStack);
