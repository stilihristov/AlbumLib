var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var grid = require('gridfs-stream');
var fs   = require('fs');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/albums');

var albumSchema = new Schema ( {
	id : Number,
	name : {type: String, index: {unique: true}},
	coverUrl : String,
	author : String,
	genre : String,
	year : Number,
	img: { data: Buffer, contentType: String }
});

var album = mongoose.model('album', albumSchema);

var currentId = 0;

var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

album.count(function (err, count) {
    if (!err && count === 0) {
        currentId = 0;
    }
	else if(!err && count != 0){
		currentId = 0;
		album.find({}, function(error, result) {
			if(error) {
				console.log(error);
			}
			if(result != null){
				var foundId = 0;
				for(var i = 0; i < result.length; i++)
				{
					if(parseInt(result[i]["id"]) > foundId) foundId = result[i]["id"];
				}
				currentId = foundId;
			}
		});
	}
});

/*album collection GET*/
app.get('/albums', function(req, res) {
	album.find({}, function(error, result) {
		if(error) {
			console.log(error);
		}
		if(result != null){
			res.send({result : result});
		}
	});
});

/*album creation POST*/
app.post('/albums', function(req, res) {

	var albumName = req.body.albumName;
	var albumGenre = req.body.albumGenre;
	var albumAuthor = req.body.albumAuthor;
	var albumYear = req.body.albumYear;
    currentId++;

	var albumReceived = new album({
		id : currentId,
		name : albumName,
		coverUrl : "place holder",
		author : albumAuthor,
		genre : albumGenre,
		year : albumYear
	});

	albumReceived.save(function(error){
		if(error) {
			console.log(error);
		}
	})

    res.send('Successfully saved album!');
});

app.put('/albums/:id', function(req, res) {
    var searchId = req.params.id;
	var newName = req.body.newName;
	var newGenre = req.body.newGenre;
	var newAuthor = req.body.newAuthor;
	var newYear = req.body.newYear;
	console.log(req.body);
    /*var newName = req.body.newName;

    var found = false;

    products.forEach(function(product, index) {
        if (!found && product.id === Number(id)) {
            product.name = newName;
        }
    });*/

	album.update(
		{id : searchId},
		{
			$set: {
				name: newName,
				genre: newGenre,
				author: newAuthor,
				year: newYear
			}
		}
	)

    res.send('Succesfully updated product!');
});

app.delete('/albums/:id', function(req, res) {
    var searchId = req.params.id;
	console.log(searchId);

	album.deleteOne({id : searchId}, function(error) {
		if(error) {
			console.log(error);
		}
	});

    res.send('Successfully deleted product!');
});

app.listen(PORT, function() {
    console.log('Server listening on ' + PORT);
});
