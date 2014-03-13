var $ = require('jquery');

$(function() {
    $('a.delete').on('click', function(e) {
        e.preventDefault();

        $anchor = $(this);
        var id = $anchor.data('id');

        $.ajax({
            method:'DELETE',
            url:'/raffles/'+id,
            success: function(response) {
                $anchor.parent().remove();
            },
            error: function(err) {
                alert('There was an error deleting your raffle.');
            }
        });
    });
});