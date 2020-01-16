const path = require('path')

module.exports = async function (params) {

    init()

    async function init() {

        try {

            params.projeto = params.projeto.map(function (nomeProjeto) {
                return path.join(params.diretorio, nomeProjeto)
            })

            delete params.diretorio

            const gerador = require('../lib/gerador')(params)

            const listaSaida = await gerador.gerarListaArtefato()

            const printer = require('../lib/printer')(params, listaSaida)

            printer.imprimirListaSaida(listaSaida)

        } catch ({ message }) {

            console.log(message)
        }
    }
}