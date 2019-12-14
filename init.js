#!/usr/bin/env node

const args = process.argv.slice(2)
const Param = require('./models/param')

init(args)

async function init(args) {

    const params = Param.getFromArgs(args)

    if (params.server) {

        const app = require('./config/express')
        require('./bin/www')(app)

        require('./routes/gerador-web')(app)

    } else {

        require('./routes/gerador-cli')(params)
    }
}