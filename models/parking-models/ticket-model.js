const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    plate_number: {
      type: String
    },
    stack_id: {
      type: String
    },
    slot_id: {
      type: Number
    },
    ticket_status: {
      type: String
    },
    park_at: {
      type: Date,
      default: Date.NOW
    },
    exit_at: {
      type: Date
    },
    price_per_hour:{
      type: Number
    },
    total_price: {
      type: Number
    }
  },{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});

module.exports = mongoose.model('Ticket', TicketSchema);

