const express = require('express')
const bodyParser = require('body-parser')
const geradorRouter = require('./routes/gerador')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', geradorRouter)

module.exports = app