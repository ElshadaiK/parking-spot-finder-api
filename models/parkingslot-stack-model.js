const mongoose = require('mongoose');

const ParkingLotStack = new mongoose.Schema({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  parking_lot_id: DataTypes.INTEGER,
  parking_lot_rank: DataTypes.INTEGER,
  slot_size_id: DataTypes.INTEGER,
  data: DataTypes.STRING,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
});

module.exports = mongoose.model('ParkingLotStack', ParkingLotStack);
