express = require('express')
synthify = require('synthify')

app = express()

synthoptions = { }

synthify.doapi(app, synthoptions)
synthify.doroutes(app, synthoptions)

app.set('views', __dirname + '/pages')

server = app.listen(3000, ->
        console.log('Listening on port %d', server.address().port)
)
