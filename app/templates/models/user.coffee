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
    getuser: (email, password, cb) ->
        self = this
        Usir = Parse.Object.extend("Usir")
        q = new Parse.Query(Usir)
        q.equalTo("email", email)
        q.first({
            success: (usir) ->
                data = {}
                if usir
                    bcrypt.compare(password, usir.get("password"), (err, res) ->
                        if res
                            data = self.mini(usir)
                        cb(null, data)
                    )
                else
                    cb(null, data)
            error: (err) ->
                console.log('no usir')
                cb(err)
        })
    doForgot: (email, usirj, cb) ->
        self = this
        Usir = Parse.Object.extend("Usir")
        q = new Parse.Query(Usir)
        q.equalTo("email", email)
        q.first({
            success: (usir) ->
              if usir
                  for k, v of usirj
                      usir.set(k, v)
                  usir.save(null, {
                      success: (usir) ->
                          cb(null, self.mini(usir))
                      error: (e) ->
                          console.log('err save')
                          console.log(e)
                          cb(e)
                  })
              else
                  cb(null)
            error: (e) ->
                console.log('error')
                console.log(e)
                cb(e)
        })
    doReset: (token, password, cb) ->
        self = this
        Usir = Parse.Object.extend("Usir")
        q = new Parse.Query(Usir)
        q.equalTo("resetPasswordToken", token)
        q.first({
            success: (usir) ->
              if usir
                  bcrypt.hash(password, 10, (err, hash) ->
                    usir.set({password: hash})
                    usir.set({resetPasswordToken: ''})
                    usir.save(null, {
                        success: (usir) ->
                            cb(null, usir.toJSON())
                        error: (e) ->
                            cb(e)
                    })
                  )
              else
                  cb(null)
        error: (e) ->
            console.log('error')
            console.log(e)
            cb(e)
        })
    register: (d, cb) ->
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
    getSocial: (provider, socid, cb) ->
        self = this
        Usir = Parse.Object.extend("Usir")
        q = new Parse.Query(Usir)
        q.equalTo(provider + "_id", socid)
        q.first({
            success: (usir) ->
                if usir
                    cb(null, self.mini(usir))
                else
                    cb(null)
            error: (e) ->
                cb(e)
        })

    createSocial: (usirj, cb) ->
        self = this
        Usir = Parse.Object.extend("Usir")
        usir = new Usir()
        usir.set(usirj)
        usir.save(null, {
            success: (usir) ->
                cb(null, self.mini(usir))
            error: (e) ->
                cb(e)
        })

    updateSocial: (id, usirj, cb) ->
        self = this
        Usir = Parse.Object.extend("Usir")
        q = new Parse.Query(Usir)
        q.get(id, {
            success: (usir) ->
                if usir
                    for k, v of usirj
                        usir.set(k, v)
                    usir.save(null, {
                        success: (usir) ->
                            cb(null, self.mini(usir))
                        error: (e) ->
                            cb(e)
                    })
                else
                    cb(null)
            error: (e) ->
                console.log('error')
                console.log(e)
                cb(e)
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
module.exports = User
