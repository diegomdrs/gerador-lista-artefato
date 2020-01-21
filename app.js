#!/usr/bin/env node

init()

async function init() {

    const commander = require('./config/commander')

    if (commander.server) {

        const app = require('./config/express')

        require('./config/http')(app)
        require('./routes/gerador-web')(app)

    } else if (commander.projeto && commander.autor && commander.task && commander.diretorio) {

        require('./routes/gerador-cli')(commander)
    } else {

        commander.outputHelp()
    }
}