const path = require('path')

module.exports = function (app) {

    app.post('/gerarListaArtefato', async function (req, resp) {

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

    // AngularJS html5mode com Node.js e Express
    app.all('/*', function (req, res) {
        res.sendFile(path.resolve('public/index.html'));
    });
}