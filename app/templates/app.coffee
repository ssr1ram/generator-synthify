express = require('express')
synthify = require('synthify')
config = require('./config')

app = express()

synthoptions = { }

synthify.doapi(app, synthoptions)
synthify.doroutes(app, synthoptions)

app.use express.static __dirname + '/public'
app.set('views', __dirname + '/pages')
app.set('view engine', 'jade')
app.use(express.compress())
app.use(express.urlencoded())
app.use(express.json())
app.use(express.methodOverride())
app.use(express.cookieParser(config.secret))
app.use(express.cookieSession({
  secret: config.secret
  key: "mykey"
  cookie: maxAge: 1000*60*60
}))
app.locals.cacheBreaker = new Date().getTime()

server = app.listen(3000, ->
        console.log('Listening on port %d', server.address().port)
)
