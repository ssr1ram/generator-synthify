express = require('express')
synthify = require('synthify')
passport = require('passport')
config = require('./config/config')
iocacheStore = require('./connect-iocache')(express)

app = express()


cacheBreaker = new Date().getTime()

app.use( (req, res, next) ->
    res.locals.cacheBreaker = cacheBreaker
    next()
)

# app.sessionStore = new parseStore({ appid: config.parse.appid, jskey: config.parse.jskey })
app.sessionStore = new iocacheStore({ hosts: config.iocache_hosts, token: config.iocache_token, project_id: config.iocache_project_id, cache_name: config.iocache_cache_name })

###
passport.serializeUser (user, done) ->
    acctpass.serializer(user, done)

passport.deserializeUser (suser, done) ->
    acctpass.deserializer(suser, done)

passport.use(new LocalStrategy( (username, password, done) ->
        process.nextTick( ->
            # do checks here
            console.log('aloha')
            acctpass.getuser(username, password, done)
        )
))
###

app.use express.static __dirname + '/public'
app.set('views', __dirname + '/pages')
app.set('view engine', 'jade')
app.use(express.compress())
app.use(express.urlencoded())
app.use(express.json())
app.use(express.methodOverride())
app.use(express.cookieParser(config.secret))
app.use(express.session({
  secret: config.secret
  store: app.sessionStore
  cookie: maxAge: 1000*60*60
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(app.router)

app.configure('development', ->
    app.hosturl = "http://localhost:3000" # needed for passport-google-oauth
)
app.configure('production', ->
    app.hosturl = config.hosturl # needed for passport-google-oauth
)

app.utility = {}
app.utility.sendmail = require('drywall-sendmail')
app.utility.slugify = require('drywall-slugify')
app.utility.workflow = require('drywall-workflow')

#setup passport
require('./config/passport')(app, passport)
synthoptions = {
    passport: passport
}

synthify.doapi(app, synthoptions)
synthify.doroutes(app, synthoptions)

server = app.listen(3000, ->
    console.log('Listening on port %d', server.address().port)
)
