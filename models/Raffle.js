var mongoose = require('mongoose');

var raffleSchema = new mongoose.Schema({
    name:String,
    entries:{
        type:String,
        default:'{}'
    }
});

module.exports = mongoose.model('Raffle', raffleSchema);