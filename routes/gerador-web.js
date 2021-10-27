const path = require('path')
const Param = require('../models/param')
const { StatusCodes } = require('http-status-codes')

const geradorCvs = require('../lib/gerador-cvs')

const GeradorPorTarefa = require('../lib/gerador-por-tarefa')
const GeradorPorTipoArtefato = require('../lib/gerador-por-tipo-artefato')

const { TIPO_LISTAGEM } = require('../lib/constants')

module.exports = function (app) {

    app.get('/verificarUltimaVersaoApp', async function (req, resp) {

        try {
            const respJson =  await require('../lib/versao').verificarUltimaVersaoApp()
            resp.json(respJson)

        } catch (error) {
            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message })
        }
    })

    app.post('/gerarListaArtefato', async function (req, resp) {

        try {
            const params = new Param({
                autor: req.body.autor,
                listaTarefa: req.body.listaTarefa,
                listaProjeto: req.body.listaProjeto,
                dataInicio: req.body.dataInicio,
                dataFim: req.body.dataFim,
                mostrarDeletados: req.body.mostrarDeletados,
                mostrarRenomeados: req.body.mostrarRenomeados,
                mostrarNumModificacao: req.body.mostrarNumModificacao,
                mostrarCommitsLocais: false
            })

            const gerador = obterTipoGerador(req.body.tipoListagem, params)
            const listaSaida = await gerador.gerarListaArtefato()

            resp.json(listaSaida)

        } catch (error) {

            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message })
        }
    })

    app.post('/obterListaArtefatoCsv', async function (req, resp) {

        try {
            const params = new Param({
                autor: req.body.autor,
                listaTarefa: req.body.listaTarefa,
                listaProjeto: req.body.listaProjeto,
                mostrarDeletados: req.body.mostrarDeletados,
                mostrarRenomeados: req.body.mostrarRenomeados,
                mostrarNumModificacao: req.body.mostrarNumModificacao,
                mostrarCommitsLocais: false
            })

            const gerador = obterTipoGerador(req.body.tipoListagem, params)
            const listaSaida = await gerador.gerarListaArtefato()
            const csv = geradorCvs.obterSaidaCsv(listaSaida)

            resp.json(csv)

        } catch (error) {

            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message })
        }
    })

    app.post('/listarDiretorio', async function (req, resp) {

        try {
            const diretorio = require('../lib/diretorio')(req.body)
            const listaSaida = await diretorio.listarDiretorio()

            resp.json(listaSaida)

        } catch (error) {

            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message })
        }
    })

    // AngularJS html5mode com Node.js e Express
    app.all('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/gerador.html'))
    });

    function obterTipoGerador(tipoListagem, params) {

        if (tipoListagem == TIPO_LISTAGEM.POR_TIPO_ARTEFATO)
            return new GeradorPorTipoArtefato(params)

        return new GeradorPorTarefa(params)
    }
}