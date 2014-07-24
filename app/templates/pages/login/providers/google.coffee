User = require("../../../models/user")
provider = 'google'

module.exports =
    getOptions: (req, res) ->
        options =
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
        if req.param('refresh')
            options['approvalPrompt'] = 'force'
            options['accessType'] = 'offline'
        return options

    setUser: (req, res, info, cb) ->
        if req.user
            if provider not in req.user.networks
                usirj = {}
                req.user.networks.push(provider)
                usirj['networks'] = req.user.networks
                usirj[provider + "_id"] = info.profile._json.id
                usirj[provider] = info
                if not req.user.email
                    usirj["email"] = info.profile._json.email
                User.updateSocial(req.user.id, usirj, (err, user) ->
                    cb(err, user)
                )
            else
                if not req.user.email
                    usirj = {}
                    usirj["email"] = info.profile._json.email
                    User.updateSocial(req.user.id, usirj, (err, user) ->
                        cb(err, user)
                    )
                else
                    cb(null, req.user)
        else
            User.getSocial(provider, info.profile._json.id, (err, user) ->
                if user
                    cb(err, user)
                else
                    usirj = {}
                    usirj['networks'] = [provider]
                    usirj['email'] = info.profile._json.email
                    usirj[provider + "_id"] = info.profile._json.id
                    usirj[provider] = info

                    User.createSocial(usirj, (err, user) ->
                        cb(err, user)
                    )
            )

