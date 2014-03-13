var Raffle = require('../models/Raffle');

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

    raffle.save(function(err) {
        response.redirect('/');
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
            response.send(doc);
        }
    });
};