var twilio = require('twilio'),
    Raffle = require('../models/Raffle');

exports.sms = function(request, response) {
    var twiml = new twilio.TwimlResponse(),
        id = request.param('id'),
        from = request.param('From'),
        body = request.param('Body');

    function derp() {
        twiml.message('There was a problem entering the raffle. Please talk to the raffle organizer.');
        response.send(twiml);
    }

    Raffle.findById(id, function(err, doc) {
        if (err || !doc) {
            derp();
        } else {
            // Enter the user by phone number as unique ID. They can text
            // in as much as they want to change their name
            var entries = JSON.parse(doc.entries);
            entries[from] = body;
            doc.entries = JSON.stringify(entries);
            doc.save(function(err) {
                if (err) {
                    derp();
                } else {
                    twiml.message('Thanks for entering! Run your own SMS raffle with The Raffler (powered by Twilio, natch): http://github.com/kwhinnery/raffler');
                    response.send(twiml);
                }
            });
        }
    });
};

exports.voice = function(request, response) {
    var twiml = new twilio.TwimlResponse();
    twiml.say('Hello there! Thanks for participating in this raffle, powered by Twilleyo. Please text your first and last name to this number to enter.', {
        voice:'alice'
    });
    response.send(twiml);
};

