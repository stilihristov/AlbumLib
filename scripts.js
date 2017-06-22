$(function() {
    // ALBUM COLLECTION
    $('#get-albums-button').on('click', function() {
        $.ajax({
          url: '/albums',
            contentType: 'application/json',
            success: function(response) {
                var tbodyEl = $('tbody');

                tbodyEl.html('');

                response.result.forEach(function(album) {
                    tbodyEl.append('\
                        <tr>\
                            <td class="id">' + album.id + '</td>\
                            <td><img src=""  alt="Album Cover" style="width:304px;height:228px;" id ="image"></td>\
                            <td><input type="text" class="name" value="' + album.name + '"></td>\
                            <td><input type="text" class="genre" value="' + album.genre + '"></td>\
                            <td><input type="text" class="author" value="' + album.author + '"></td>\
                            <td><input type="number" class="year" value="' + album.year + '"></td>\
                            <td>\
                                <button class="update-button">UPDATE/PUT</button>\
                                <button class="delete-button">DELETE</button>\
                            </td>\
                        </tr>\
                    ');

                    var tempImageUrl = "\"data:image/png\";base64," + album.img;
                    document.getElementById('image').src = tempImageUrl;
                });

            }
        });
    });

	// ALBUM CREATION
	$('#album-input').on('submit', function(event) {
        event.preventDefault();

        var albumName = $('#album-input-name');
        var albumGenre = $('#album-input-genre');
        var albumAuthor = $('#album-input-author');
        var albumYear = $('#album-input-year');
        var albumCover = $('#album-input-image');

        $.ajax({
            url: '/albums',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
				albumName:  albumName.val(),
				albumGenre:  albumGenre.val(),
				albumAuthor:  albumAuthor.val(),
				albumYear:  albumYear.val(),
        albumCover:  albumCover.val().base64
        }),
            success: function(response) {
                console.log(response);
                //createInput.val('');
                $('#get-albums-button').click();
            }
        });
    });

    // UPDATE/PUT
    $('table').on('click', '.update-button', function() {
        var rowEl = $(this).closest('tr');
        var id = rowEl.find('.id').text();
        var newName = rowEl.find('.name').val();
        var newGenre = rowEl.find('.genre').val();
        var newAuthor = rowEl.find('.author').val();
        var newYear = rowEl.find('.year').val();

        $.ajax({
            url: '/albums/' + id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ newName: newName, newGenre: newGenre, newAuthor: newAuthor, newYear: newYear }),
            success: function(response) {
                console.log(response);
                $('#get-albums-button').click();
            }
        });
    });

    // DELETE
    $('table').on('click', '.delete-button', function() {
        var rowEl = $(this).closest('tr');
        var id = rowEl.find('.id').text();

        $.ajax({
            url: '/albums/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                console.log(response);
                $('#get-albums-button').click();
            }
        });
    });
});
