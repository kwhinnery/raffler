var $ = require('jquery'),
    buzz = require('node-buzz');

// Little plugin to shuffle child elements randomly
$.fn.shuffle = function () {
    var j;
    for (var i = 0; i < this.length; i++) {
        j = Math.floor(Math.random() * this.length);
        $(this[i]).before($(this[j]));
    }
    return this;
};

$(function() {
    var $entries = $('#chooser span'),
        shuffling = false,
        shuffler = null,
        fx = new buzz.sound('/shuffle.wav');

    $('button').on('click', function() {
        if (!shuffling) {
            fx.play().loop();
            shuffling = true;
            $(this).html('STOP');
            // Start the shuffle
            shuffler = setInterval(function() {
                $entries.shuffle();
            },100);
        } else {
            fx.stop();
            shuffling = false;
            $(this).html('START!');
            clearInterval(shuffler);

            // Add the winnar to the list
            var winnar = $('#chooser span').first().html();
            $('#winnars').append('<li>'+winnar+'</li>');
        }
    });
});