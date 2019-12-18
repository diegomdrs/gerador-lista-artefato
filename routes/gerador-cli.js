
module.exports = async function (params) {

    const gerador = require('../lib/gerador')(params)

    const listaFoo = await gerador.gerarListaArtefato()

    imprimirListaSaida(listaFoo)

    function imprimirListaSaida(listaSaida) {

        console.log('')

        for (const saida of listaSaida) {

            if (saida.listaNumTarefaSaida.length === 1)
                console.log('Tarefa nº ' + saida.listaNumTarefaSaida[0] + '\n')
            else if (saida.listaNumTarefaSaida.length > 1) {
                console.log('Tarefas nº ' + saida.listaNumTarefaSaida.join(', ') + '\n')
            }

            for (const artefato of saida.listaArtefatoSaida) {
                console.log(imprimirSaida(artefato.tipoAlteracao,
                    artefato.numeroAlteracao, artefato.nomeArtefato))
            }

            console.log('')
        }
    }

    function imprimirSaida(tipoAlteracao, numeroAlteracao, nomeArtefato) {

        let retorno = tipoAlteracao + '\t'

        params.mostrarNumModificacao && (
            retorno = retorno.concat(numeroAlteracao + '\t'))

        retorno = retorno.concat(nomeArtefato)

        return retorno
    }
}