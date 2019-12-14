
module.exports = function (app) {

    app.post('/gerador', async function (req, resp) {

        const Param = require('../models/param')
        const params = new Param(req.body)
        const gerador = require('../lib/gerador')(params)

        resp.json(await gerador.gerarListaArtefato())
    })
}