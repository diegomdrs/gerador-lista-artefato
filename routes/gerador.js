
module.exports = function (app) {

    const gerador = require('../bin/gerador')

    gerador.gerarListaArtefato(app.params)

    // app.post('/gerador', gerador.gerarListaArtefato(app.params))
}