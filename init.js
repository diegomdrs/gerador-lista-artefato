#!/usr/bin/env node

const Param = require('./models/param')

init()

async function init() {

    const params = require('./config/commander')

    if (params.server) {

        const app = require('./config/express')
        require('./bin/www')(app)

        require('./routes/gerador-web')(app)

    } else {

        require('./routes/gerador-cli')(params)
    }
}