#!/usr/bin/env node

init()

async function init() {

    const params = require('./config/commander')

    if (params.server) {

        const app = require('./config/express')
        
        require('./config/http')(app)
        require('./routes/gerador-web')(app)

    } else {

        require('./routes/gerador-cli')(params)
    }
}