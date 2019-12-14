
module.exports = function (app) {

    const Param = require('../models/param')

    app.post('/gerador', async function (req, resp) {

        const params = Param.getFromBody(req.body)
        const gerador = require('../bin/gerador')(params)

        resp.json(gerador.gerarListaArtefato)
    })
}