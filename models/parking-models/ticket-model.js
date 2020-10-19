const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    plate_number: {
      type: String
    },
    vehicle_size_id: {
      type: String // todo small car can park in medium slot
    },
    slot_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'Slot'
    },
    ticket_status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TicketStatus',
    },
    park_at: {
      type: Date,
      default: DataTypes.NOW
    },
    exit_at: {
      type: Date,
      default: DataTypes.NOW
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

module.exports = mongoose.model('Ticket', TicketSchema);

