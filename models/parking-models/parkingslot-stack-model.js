const { json } = require('express');
const mongoose = require('mongoose');

const ParkingLotStack = new mongoose.Schema({

  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Companies' },

  location: {
    type: {
      type: String, 
      enum: "Point", default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true
    }, 
  },

  parking_slots : {type: Number},
  
  floor : {type: Number, default: 1},

  parking_lot_rank: {type: Number},

  full_status : {type: Boolean, default: false}, 

  data: {type: String},

  slots: {type: Number},
  price: {type: Number},
  rating: {type: Number},
  distance: {}

},{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});

ParkingLotStack.index({ location : "2dsphere" });

module.exports = mongoose.model('ParkingLotStack', ParkingLotStack);
