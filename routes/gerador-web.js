
module.exports = function (app) {

    app.post('/gerador', async function (req, resp) {

        const BAD_REQUEST_CODE = 400

        try {
            const Param = require('../models/param')
            const params = new Param(req.body)
            const gerador = require('../lib/gerador')(params)

            resp.json(await gerador.gerarListaArtefato())

        } catch (error) {

            resp.status(BAD_REQUEST_CODE).send({ message: error.message })
        }
    })
}