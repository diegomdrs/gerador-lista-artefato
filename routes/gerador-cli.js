
module.exports = async function (params) {

    const gerador = require('../lib/gerador')(params)

    const listaFoo = await gerador.gerarListaArtefato()

    imprimirListaFoo(listaFoo)

    // imprimirListaArtefato(listaArtefato)

    // function imprimirListaArtefato(listaArtefato) {

    //     console.log('')

    //     imprimirListaArtefatoComTarefaMesmoTipo(listaArtefato.listaArtefato)
    //     imprimirListaTarefaFoo(listaArtefato.listaTarefaFoo)
    // }

    function imprimirListaFoo(listaFoo) {

        listaFoo.forEach(foo => {

            if (foo.listaNumTarefa.length === 1)
                console.log('Tarefa nº ' + foo.listaNumTarefa[0] + '\n')
            else if (foo.listaNumTarefa.length > 1) {
                console.log('Tarefas nº ' + foo.listaNumTarefa.join(', ') + '\n')
            }

            foo.listaArtefatoFoo.forEach(function (artefato) {
                console.log(imprimirFoo(artefato.tipoAlteracao,
                    artefato.numeroAlteracao, artefato.nomeArtefato))
            })

            console.log('')
        })
    }

    function imprimirListaArtefatoComTarefaMesmoTipo(listaArtefato) {
        listaArtefato.forEach(artefato => {

            const tarefas = artefato.listaTarefa.reduce((accum, tarefa) => {
                accum.listaTarefa.push(tarefa.numTarefa)
                params.mostrarNumModificacao &&
                    (accum.totalModificacao += tarefa.numeroAlteracao)

                return accum
            }, { totalModificacao: 0, listaTarefa: [] })

            console.log('Tarefas nº ' + tarefas.listaTarefa.join(', ') + '\n')
            console.log(foo('M', tarefas.totalModificacao, artefato.nomeArtefato))
            console.log('')
        })
    }

    function imprimirListaTarefaFoo(listaTarefaFoo) {

        listaTarefaFoo.forEach(function (tarefaFoo) {

            console.log('Tarefa nº ' + tarefaFoo.numTarefa + '\n')

            tarefaFoo.listaArtefatoFoo.forEach(function (artefatoFoo) {

                console.log(imprimirFoo(artefatoFoo.tipoAlteracao,
                    artefatoFoo.numeroAlteracao, artefatoFoo.nomeArtefato))
            })

            console.log('')
        })
    }

    function imprimirFoo(tipoAlteracao, numeroAlteracao, nomeArtefato) {

        let retorno = tipoAlteracao + '\t'

        params.mostrarNumModificacao && (
            retorno = retorno.concat(numeroAlteracao + '\t'))

        retorno = retorno.concat(nomeArtefato)

        return retorno
    }
}