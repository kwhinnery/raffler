var app = require('gopher'),
    twilio = require('twilio'),
    express = require('express'),
    mongoose = require('mongoose');

// Initialize MongoDB and mongoose
mongoose.connect(process.env.MONGOHQ_URL);

// Controllers to handle HTTP requests
var twilioController = require('./controllers/twilio'),
    raffleController = require('./controllers/raffle');

// Set up Twilio Webhook Route to handle new entries
app.post('/raffles/:id', twilio.webhook({
    validate: process.NODE_ENV === 'production'
}), twilioController.sms);

// Set up admin UI routes, secured with HTTP Basic Auth
var auth = express.basicAuth(process.env.BASIC_UN, process.env.BASIC_PW);

// Middleware to redirect all non-secure traffic to an SSL endpoint - use
// Heroku's header to determine if the original request was over SSL or not
var secure = function(request, response, next) {
    // Check current environment and Heroku protocol header
    var prod = process.env.NODE_ENV === 'production',
        notSecure = request.header('x-forwarded-proto') !== 'https';

    // Redirect to SSL if necessary
    if (prod && notSecure) {
        var host = request.header('host'), url = request.url;
        response.redirect('https://'+ host + url);
    }

    // Otherwise continue to process the request
    next();
};

// Home page, show all raffles
app.get('/', secure, auth, raffleController.index);
app.get('/raffles', secure, auth, raffleController.index);

// Create A Raffle
app.post('/raffles', secure, auth, raffleController.create);

// Display and run the given raffle
app.get('/raffles/:id', secure, auth, raffleController.show);

// Delete a raffle
app.delete('/raffles/:id', secure, auth, raffleController.remove);


