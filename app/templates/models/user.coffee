Parse = require('parse').Parse
config = require("../config/config")
Parse.initialize(config.parse_appid, config.parse_jskey)
bcrypt = require('bcrypt')

User =
    mini: (usir) ->
        data =
            id: usir.id
            username: usir.get("username")
            email: usir.get("email")
            networks: usir.get("networks")
        return data
    getuser: (username, password, cb) ->
        Usir = Parse.Object.extend("Usir")
        q = new Parse.Query(Usir)
        q.equalTo("username", username)
        q.first({
            success: (usir) ->
                data = {}
                if usir
                    bcrypt.compare(password, usir.get("password"), (err, res) ->
                        if res
                            console.log('got password')
                            data = this.mini(usir)
                        cb(null, data)
                    )
                else
                    cb(null, data)
            error: (err) ->
                cb(err)
        })
    register: (d, cb) ->
        # mailgun = require('mailgun')
        # mgConfig = require('../configs/mailgun')
        # mg = new mailgun.Mailgun(mgConfig.apiKey)
        # emt = require('./email')

        @username_check(d.username, (u) ->
            if u
                if u.username
                    cb("Username exists")
                    return
            bcrypt.hash(d.password, 10, (err, hash) ->
              d.password = hash
              Usir = Parse.Object.extend("Usir")
              usir = new Usir()
              usir.set(d)
              usir.save(null, {
                  success: (usir) ->
                      # text = emt.post_register(usir)
                      # mg.sendText("dev@domain.com", usir.get("email"), "Welcome!", text)
                      cb(null, usir.toJSON())
                  error: (e) ->
                      cb(e)
              })
            )
        )
    createSocial: (network, info, cb) ->
        Usir = Parse.Object.extend("Usir")
        usir = new Usir()
        if network == 'google'
            usir.set({
                email: info.profile._json.email
                networks: ['google']
                google: info
            })
            usir.save(null, {
                success: (usir) ->
                    cb(null, this.mini(usir))
                error: (e) ->
                    cb(e)
            })
    updateSocial: (network, user, info, cb) ->
        Usir = Parse.Object.extend("Usir")
        q = new Parse.Query(Usir)
        self = this
        q.get(id, {
            success: (usir) ->
                if network == 'google'
                    networks = usir.get("networks") || []
                    if 'google' not in "networks"
                        networks.push('google')
                        usir.set({
                            networks: networks
                            google: info
                        })
                        usir.save(null, {
                            success: (usir) ->
                                cb(null, self.mini(usir))
                            error: (e) ->
                                cb(e)
                        })
                    else
                        cb(null, self.mini(usir))
                else
                    cb(null, self.mini(usir))
            error: (err) ->
                cb(err)
        })

    username_check: (username, cb) ->
        Usir = Parse.Object.extend("Usir")
        q = new Parse.Query(Usir)
        q.equalTo("username", username)
        q.first({
            success: (usir) ->
                if usir
                    data = JSON.stringify(usir)
                    cb(usir)
                else
                    cb()
            error: (err) ->
                cb()
        })
    confirm: (uid, cb) ->
        Usir = Parse.Object.extend("Usir")
        q = new Parse.Query(Usir)
        q.get(uid, {
            success: (usir) ->
                if usir.id
                    usir.set("emailConfirmed", "y")
                    usir.save({
                        success: (usir) ->
                            cb(usir.toJSON())
                    })
                else
                    cb()
            error: (err) ->
                cb()
        })
    forgot: (d, cb) ->
        mailgun = require('mailgun')
        mgConfig = require('../configs/mailgun')
        mg = new mailgun.Mailgun(mgConfig.apiKey)
        emt = require('./email')

        if not d.email
            cb()

        Usir = Parse.Object.extend("Usir")
        q = new Parse.Query(Usir)
        q.equalTo("email", d.email)
        q.first({
            success: (usir) ->
                if usir.id
                    text = emt.post_forgot(usir)
                    mg.sendText("dev@teragulp.com", usir.get("email"), "Password Reset", text)
                    cb(usir)
                error: (e) ->
                    cb()
        })
    reset: (d, cb) ->
        Usir = Parse.Object.extend("Usir")
        q = new Parse.Query(Usir)
        q.get(d.uid, {
            success: (usir) ->
                if usir.id
                    usir.set("password", d.password)
                    usir.save({
                        success: (usir) ->
                            cb(usir.toJSON())
                    })
                else
                    cb()
            error: (err) ->
                cb()
        })

module.exports = User
