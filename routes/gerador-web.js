const path = require('path')
const Param = require('../models/param')

module.exports = function (app) {

    app.post('/gerarListaArtefato', async function (req, resp) {

        const BAD_REQUEST_CODE = 400

        try {
            const params = new Param(req.body)

            const gerador = require('../lib/gerador')(params)
            const listaSaida = await gerador.gerarListaArtefato()
 
            resp.json(listaSaida)

        } catch (error) {

            resp.status(BAD_REQUEST_CODE).send({ message: error.message })
        }
    })

    // AngularJS html5mode com Node.js e Express
    app.all('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/gerador.html'))
    });
}