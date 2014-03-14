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
        shuffleSound = new buzz.sound('/shuffle.wav', {
            preload:true
        }),
        victorySound = new buzz.sound('/victory.mp3', {
            preload:true
        });

    $('button').on('click', function() {
        if (!shuffling) {
            shuffling = true;

            // Audio
            victorySound.stop();
            shuffleSound.play().loop();

            // Start the shuffle
            var $winnar = $('#chooser span').first();
            $winnar.css('color','yellow').html($winnar.data('name'));

            $(this).html('STOP');
            shuffler = setInterval(function() {
                $entries.shuffle();
            },50);
        } else {
            shuffling = false;
            var $winnar = $('#chooser span').first();
            shuffleSound.stop();
            $(this).html('START!');
            clearInterval(shuffler);

            if ($winnar.length > 0) {
                victorySound.setVolume(100);
                victorySound.play().fadeOut(9000);

                // Add the winnar to the list
                var winnar = $winnar.html();
                $winnar.html('>>>> '+winnar+' <<<<'.toUpperCase())
                    .css('color','cyan');
                $('#winnars').append('<li>'+winnar+'</li>');
            }
        }
    });
});