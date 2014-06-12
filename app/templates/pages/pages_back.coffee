synthify = require('synthify')

getIndex = (req, res) ->
    res.render("index.jade")

getFoo = (req, res) ->
    synthify.apiPreload(req, res, "/api/foo", (data) ->
        res.render("foo/foo.jade", {preloadData: data})
    )

getBar = (req, res) ->
    res.render("bar.jade")

module.exports.synthup = [
    {route: '/', method: "get", fn: getIndex}
    {route: '/foo', method: "get", fn: getFoo}
    {route: '/bar', method: "get", fn: getBar}
]

