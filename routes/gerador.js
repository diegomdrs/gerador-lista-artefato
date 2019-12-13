
module.exports = function (app) {

    const gerador = require('../bin/gerador')
    const Param = require('../models/param')

    app.post('/gerador', function (req, resp) {

        const params = Param.getFromBody(req.body)

        resp.json(gerador.gerarListaArtefato(params))
    })
}