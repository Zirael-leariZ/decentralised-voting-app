const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const VoteSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    domain: {
        type: String,
        required: [true, 'Vote domain must be provided'],
    },
    status: {
        type: String,
        required: [true, 'Vote status must be provided'],
    },
    num_participants: {
        type: Number,
        required: [true, 'Number of participants must be provided'],
    },
    description: {
        type: String,
        required: [true, 'Vote description must be provided'],
    },
    option: {
        type: String,
        required: [true, 'Vote option must be provided'],
    }
});

// // Attach the auto-increment plugin to the schema
// VoteSchema.plugin(AutoIncrement, { inc_field: 'id' });

module.exports = mongoose.model('votes', VoteSchema);