
module.exports = function (app) {

    const Param = require('../models/param')

    app.post('/gerador', async function (req, resp) {

        const params = new Param(req.body)
        const gerador = require('../lib/gerador')(params)

        resp.json(await gerador.gerarListaArtefato())
    })
}