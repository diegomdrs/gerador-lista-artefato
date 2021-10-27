const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.use(express.json())

app.use(express.static(path.join(__dirname, '../public')))

app.use('/css/bootstrap.min.css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css/bootstrap.min.css')))
app.use('/css/angular-block-ui.min.css', express.static(path.join(__dirname, '../node_modules/angular-block-ui/dist/angular-block-ui.min.css')))
app.use('/css/open-iconic-bootstrap.min.css', express.static(path.join(__dirname, '../node_modules/open-iconic/font/css/open-iconic-bootstrap.min.css')))

app.use('/fonts/open-iconic.woff', express.static(path.join(__dirname, '../node_modules/open-iconic/font/fonts/open-iconic.woff')))

app.use('/js/lib/angular.min.js', express.static(path.join(__dirname, '../node_modules/angular/angular.min.js')))
app.use('/js/lib/angular-filter.min.js', express.static(path.join(__dirname, '../node_modules/angular-filter/dist/angular-filter.min.js')))
app.use('/js/lib/moment.min.js', express.static(path.join(__dirname, '../node_modules/moment/min/moment.min.js')))
app.use('/js/lib/angular-moment.min.js', express.static(path.join(__dirname, '../node_modules/angular-moment/angular-moment.min.js')))
app.use('/js/lib/angular-route.min.js', express.static(path.join(__dirname, '../node_modules/angular-route/angular-route.min.js')))
app.use('/js/lib/angular-resource.min.js', express.static(path.join(__dirname, '../node_modules/angular-resource/angular-resource.min.js')))
app.use('/js/lib/angular-block-ui.min.js', express.static(path.join(__dirname, '../node_modules/angular-block-ui/dist/angular-block-ui.min.js')))
app.use('/js/lib/ng-device-detector.min.js', express.static(path.join(__dirname, '../node_modules/ng-device-detector/ng-device-detector.min.js')))
app.use('/js/lib/ua-device-detector.min.js', express.static(path.join(__dirname, '../node_modules/ua-device-detector/ua-device-detector.min.js')))
app.use('/js/lib/re-tree.min.js', express.static(path.join(__dirname, '../node_modules/re-tree/re-tree.min.js')))
app.use('/js/lib/angular-file-saver.bundle.min.js', express.static(path.join(__dirname, '../node_modules/angular-file-saver/dist/angular-file-saver.bundle.min.js')))

app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

module.exports = app