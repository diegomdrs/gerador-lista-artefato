const TIPO_MODIFICACAO = require('../lib/constants').TIPO_MODIFICACAO

module.exports = (params, listaSaida) => {

    return {

        imprimirListaSaida : () => {

            console.log('')

            for (const saida of listaSaida) {

                if (saida.listaNumTarefaSaida.length === 1)

                    console.log('Tarefa nº ' + saida.listaNumTarefaSaida[0] + '\n')

                else if (saida.listaNumTarefaSaida.length > 1) {

                    console.log('Tarefas nº ' + saida.listaNumTarefaSaida.join(', ') + '\n')
                }

                for (const artefato of saida.listaArtefatoSaida)
                    console.log(imprimirSaida(artefato))

                console.log('')
            }
        }
    }

    function imprimirSaida(artefato) {

        let retorno = artefato.tipoAlteracao + '\t'

        params.mostrarNumModificacao && (
            retorno = retorno.concat(artefato.numeroAlteracao + '\t'))

        if (artefato.tipoAlteracao === TIPO_MODIFICACAO.RENAMED) {

            retorno = retorno.concat(artefato.nomeAntigoArtefato + '\t'
                + artefato.nomeNovoArtefato)
        } else {

            retorno = retorno.concat(artefato.nomeArtefato)
        }

        return retorno
    }
}