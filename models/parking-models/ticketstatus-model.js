const mongoose = require('mongoose');

const TicketStatusSchema = new mongoose.Schema({
      name: {
        type: String
      },
    },{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
  });

  module.exports = mongoose.model('TicketStatus', TicketStatusSchema);
