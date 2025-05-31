const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Create schema for voting
const VoteSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,   // Unique identifier for each poll
  },
  domain: {
    type: String,
    required: [true, 'Vote domain must be provided'],  // Domain for the voting
  },
  status: {
    type: String,
    enum: ['active', 'completed'],  // Status of the vote (active or completed)
    required: [true, 'Vote status must be provided'],
  },
  num_participants: {
    type: Number,
    required: [true, 'Number of participants must be provided'],  // Number of participants
  },
  description: {
    type: String,
    required: [true, 'Vote description must be provided'],  // Description of the poll
  },
  options: {
    type: [String],
    required: [true, 'Vote options must be provided'],  // Options for voting
  },
  expiration_date: {
    type: Date,
    required: [true, 'Expiration date must be provided'],  // Expiration date of the poll
  },
  contract_address: {
    type: String,
    required: [true, 'Contract address must be provided'],  // Smart contract address
  },
  contract_abi: {
    type: Object,
    required: [true, 'Contract ABI must be provided'],  // Smart contract ABI
  },
  total_votes: {
    type: Number,
    default: 0,   // Initially, total votes is set to 0
  },
  winner: {
    type: String,   // The winner of the poll
  },
  winning_percentage: {
    type: Number,   // Percentage of the winning votes
  },
});

// Use AutoIncrement for the 'id' field
VoteSchema.plugin(AutoIncrement, { 
  inc_field: 'id',
  id: 'vote_counter',  // Unique counter for each vote
});

// Export the model
module.exports = mongoose.model('votes', VoteSchema);
