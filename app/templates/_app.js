var express = require('express');
var synthify = require('synthify')

var app = express();

var synthoptions = {
};

synthify.doapi(app, synthoptions);
synthify.doroutes(app, synthoptions);

app.set('views', __dirname + '/pages');

var server = app.listen(3000, function() {
        console.log('Listening on port %d', server.address().port);
});
