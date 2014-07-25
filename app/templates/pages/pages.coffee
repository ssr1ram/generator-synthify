synthify = require('synthify')

module.exports.getIndex = (req, res) ->
    res.render("index/index.jade")

module.exports.getFoo = (req, res) ->
    synthify.apiPreload(req, res, "/api/foo", (data) ->
        res.render("foo/foo.jade", {preloadData: data})
    )

module.exports.getBar = (req, res) ->
    res.render("bar.jade")

