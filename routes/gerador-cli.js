
module.exports = async function (params) {

    const gerador = require('../lib/gerador')(params)

    const listaArtefato = await gerador.gerarListaArtefato()

    imprimirListaArtefato(listaArtefato)

    function imprimirListaArtefato(listaArtefato) {

        console.log('')

        imprimirListaArtefatoComTarefaMesmoTipo(listaArtefato.listaArtefatoComTarefaMesmoTipo)
        imprimirListaArtefatoSemTarefaMesmoTipo(listaArtefato.listaArtefatoSemTarefaMesmoTipo)
    }

    function imprimirListaArtefatoComTarefaMesmoTipo(listaArtefatoComTarefaMesmoTipo) {
        listaArtefatoComTarefaMesmoTipo.forEach(artefato => {

            const tarefas = artefato.listaTarefa.reduce((accum, tarefa) => {
                accum.listaTarefa.push(tarefa.numTarefa)
                params.mostrarNumModificacao && 
                    (accum.totalModificacao += tarefa.numeroAlteracao)

                return accum
            }, { totalModificacao: 0, listaTarefa: [] })

            console.log('Tarefas nº ' + tarefas.listaTarefa.join(', ') + '\n')
            console.log('M\t' + 
                (params.mostrarNumModificacao && tarefas.totalModificacao + '\t') +
                artefato.nomeArtefato + '\n')
        })
    }

    function imprimirListaArtefatoSemTarefaMesmoTipo(listaArtefatoSemTarefaMesmoTipo) {

        gerador.listaTarefaComSaida.forEach(tarefaParam => {

            console.log('Tarefa nº ' + tarefaParam + '\n')

            listaArtefatoSemTarefaMesmoTipo.forEach(artefato => {

                artefato.listaTarefa.filter(tarefa =>
                    tarefa.numTarefa === tarefaParam).forEach(tarefa => {

                        console.log(tarefa.tipoAlteracao + '\t' +
                            (params.mostrarNumModificacao && tarefa.numeroAlteracao + '\t') +
                            artefato.nomeArtefato)
                    })
            })

            console.log('')
        })
    }
}