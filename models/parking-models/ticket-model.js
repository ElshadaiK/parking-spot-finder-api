const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    plate_number: {
      type: String
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
      default: Date.NOW
    },
    exit_at: {
      type: Date,
      default: Date.NOW
    },
  },{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});

module.exports = mongoose.model('Ticket', TicketSchema);

