const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    username: {
        type: String,
        required: [true, 'User username must be provided'],
    },
    password: {
        type: String,
        required: [true, 'User password must be provided'],
    }
});

// Attach the auto-increment plugin to the schema
UserSchema.plugin(AutoIncrement, { inc_field: 'id' });

module.exports = mongoose.model('users', UserSchema);