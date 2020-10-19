const mongoose = require('mongoose');

const VehicleSizeSchema = new mongoose.Schema({
      name: {
        type: String
      },
      created_at: {
        type: Date,
        default: DataTypes.NOW,
      },
      updated_at: {
        type: Date,
        default: DataTypes.NOW,
      }
  });

  module.exports = mongoose.model('VehicleSize', VehicleSizeSchema);
  
