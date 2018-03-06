var express = require('express')
var path = require('path')
var serveStatic = require('serve-static')

var app = express()

app.use(serveStatic(path.join(__dirname)))
app.use(serveStatic(path.join('src/')))
app.use(serveStatic(path.join('build/contracts')))
app.listen(3301, function () {
    console.log('Server running on localhost:3301...')
})
