// Configuration for The Raffler
module.exports = {
    // Your Twilio Account Information
    twilio: {
        sid: process.env.TWILIO_ACCOUNT_SID,
        tkn: process.env.TWILIO_AUTH_TOKEN
    },

    // Your config information for your production server (used for
    // request signature verification and setting up webhooks for new Twilio
    // numbers.
    server: {
        host: 'twilio-raffler.herokuapp.com',
        protocol: 'https'
    },

    // The connection string for your MongoDB server.  I recommend a hosted
    // service like MongoHQ. Easy to set up.
    mongoUrl: process.env.MONGOHQ_URL,

    // HTTP basic auth username and password
    username: process.env.BASIC_UN,
    password: process.env.BASIC_PW
};