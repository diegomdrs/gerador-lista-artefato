const path = require('path')

module.exports = async function (params) {

    init()

    async function init() {

        try {
            params.projeto = params.projeto.map(function(nomeProjeto){
                return path.join(params.diretorio, nomeProjeto)
            })

            delete params.diretorio

            const gerador = require('../lib/gerador')(params)

            const listaSaida = await gerador.gerarListaArtefato()
            imprimirListaSaida(listaSaida)

        } catch ({message}) {

            console.log(message)
        }
    }

    function imprimirListaSaida(listaSaida) {

        console.log('')

        for (const saida of listaSaida) {

            if (saida.listaNumTarefaSaida.length === 1)
                console.log('Tarefa nº ' + saida.listaNumTarefaSaida[0] + '\n')
            else if (saida.listaNumTarefaSaida.length > 1) {
                console.log('Tarefas nº ' + saida.listaNumTarefaSaida.join(', ') + '\n')
            }

            for (const artefato of saida.listaArtefatoSaida) {
                console.log(imprimirSaida(artefato))
            }

            console.log('')
        }
    }

    function imprimirSaida(artefato) {

        let retorno = artefato.tipoAlteracao + '\t'

        params.mostrarNumModificacao && (
            retorno = retorno.concat(artefato.numeroAlteracao + '\t'))

        if(artefato.tipoAlteracao === 'R') {
            retorno = retorno.concat(artefato.nomeAntigoArtefato + '\t' + artefato.nomeNovoArtefato)
        } else {
            retorno = retorno.concat(artefato.nomeArtefato)
        }

        return retorno
    }
}