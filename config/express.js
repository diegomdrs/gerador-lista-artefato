const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.use(express.json())

app.use(express.static('./public'))
app.use('/css', express.static('./node_modules/bootstrap/dist/css'))

app.use('/js/lib', express.static('./node_modules/angular'))
app.use('/js/lib', express.static('./node_modules/angular-route'))
app.use('/js/lib', express.static('./node_modules/angular-resource'))

// AngularJS html5mode com Node.js e Express
app.all('/*', function (req, res) {
    res.sendFile(path.resolve('public/index.html'));
});

app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

module.exports = app