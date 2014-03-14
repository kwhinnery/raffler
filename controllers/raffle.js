var Raffle = require('../models/Raffle'),
    twilio = require('twilio'),
    config = require('../config');

// Create an authenticated twilio REST API client
var client = twilio(config.twilio.sid, config.twilio.tkn);

// Display home page
exports.index = function(request, response) {
    Raffle.find().select('-entries').exec(function(err, raffles) {
        response.render('index', {
            staticfile:'index',
            raffles:raffles
        });
    });
};

// Create a raffle
exports.create = function(request, response) {
    var raffle = new Raffle({
        name: request.param('name')
    });

    raffle.save(function(err, doc) {
        if (!err) {
            // Programmatically buy a twilio number
            client.availablePhoneNumbers('US').local.get({
                smsEnabled:true
            }).then(function(results) {
                if (results.availablePhoneNumbers.length < 1) {
                    throw { message: 'No phone numbers available' };
                }

                return client.incomingPhoneNumbers.create({
                    phoneNumber: results.availablePhoneNumbers[0].phoneNumber,
                    friendlyName: '[The Raffler]: '+doc.name,
                    smsUrl: config.server.protocol + 
                        '://' + config.server.host +
                        '/raffles/'+doc._id
                });
            }).then(function(data) {
                raffle.twilioNumber = data.phoneNumber;
                raffle.twilioNumberSid = data.sid;
                raffle.save(function(err) {
                    response.redirect('/');
                });
            }).fail(function(err) {
                console.error(err);
                response.redirect('/');
            });
        } else {
            console.error(err);
            response.redirect('/');
        }
    });
};

// Display an individual raffle
exports.show = function(request, response) {
    Raffle.findById(request.param('id'), function(err, doc) {
        if (err || !doc) {
            response.send(404, 'Raffle Not Found.');
        } else {
            response.render('show', {
                staticfile:'show',
                raffle:doc,
                entries:JSON.parse(doc.entries)
            });
        }
    });
};

// Delete the given raffle
exports.remove = function(request, response) {
    var id = request.param('id');
    Raffle.findByIdAndRemove(id, function(err, doc) {
        if (err) {
            response.send(500, err);
        } else {
            client.incomingPhoneNumbers(doc.twilioNumberSid).delete(function(err) {
                if (err) {
                    response.send(500, err);
                } else {
                    response.send(doc);
                }
            });
        }
    });
};