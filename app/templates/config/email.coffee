config = require("./config")

module.exports =
    x: 1
    sendMail: (options, cb) ->
        if config.email_service == 'mailgun'
            mailgun = require("mailgun")
            mg = new mailgun.Mailgun(config.mailgun_api_key)
            from = options.from || config.email_from
            mg.sendText(from, options.to, options.subject, options.text, (err) ->
                if err
                    console.log('mail send err')
                    console.log(err)
                cb()
            )
        else
            cb()
