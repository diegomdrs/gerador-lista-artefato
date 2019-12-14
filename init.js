#!/usr/bin/env node

const args = process.argv.slice(2)
const Param = require('./models/param')
const debug = require('debug')('gerador-artefato:server');

const PORT = '3000'
let server = {}

init(args)

function init(args) {

    const params = Param.getFromArgs(args)

    if (params.server) {

        const app = require('./config/express')
        require('./bin/www')(app)

        require('./routes/gerador-web')(app)

    } else {

        const gerador = require('./lib/gerador')(params)

        // await gerador.gerarListaArtefato()
        // console.log(params)
    }
}