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

// Home page, show all raffles
app.get('/', auth, raffleController.index);
app.get('/raffles', auth, raffleController.index);

// Create A Raffle
app.post('/raffles', auth, raffleController.create);

// Display and run the given raffle
app.get('/raffles/:id', auth, raffleController.show);

// Delete a raffle
app.delete('/raffles/:id', auth, raffleController.remove);


