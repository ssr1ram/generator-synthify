
module.exports.init = (req, res) ->
    if req.isAuthenticated()
        res.redirect("/account/")
    else
        res.render("login/index.jade")

module.exports.login = (req, res) ->
  workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', () ->
    if !req.body.username
      workflow.outcome.errfor.username = 'required'

    if !req.body.password
      workflow.outcome.errfor.password = 'required'

    if workflow.hasErrors()
      return workflow.emit('response')

    workflow.emit('attemptLogin')
  )

  workflow.on('attemptLogin', () ->
    req._passport.instance.authenticate('local', (err, user, info) ->
      if err
        return workflow.emit('exception', err)

      if !user
        workflow.outcome.errors.push('Username and password combination not found or your account is inactive.')
        return workflow.emit('response')
      else
        req.login(user, (err) ->
          if err
            return workflow.emit('exception', err)
          workflow.emit('response')
        )
    )(req, res)
  )

  workflow.emit('validate')


module.exports.logout = (req, res) ->
    req.logout()
    res.redirect("/")
