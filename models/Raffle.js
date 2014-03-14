var mongoose = require('mongoose');

var raffleSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    twilioNumber: {
        type: String,
        default: 'No Phone Number Configured!'
    },
    twilioNumberSid: String,
    entries: {
        type: String,
        default: '{}'
    }
});

module.exports = mongoose.model('Raffle', raffleSchema);