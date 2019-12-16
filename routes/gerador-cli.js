
module.exports = async function (params) {

    const gerador = require('../lib/gerador')(params)

    const listaArtefato = await gerador.gerarListaArtefato()

    imprimirListaArtefato(listaArtefato)

    function imprimirListaArtefato(listaArtefato) {

        console.log('')

        imprimirListaArtefatoComTarefaMesmoTipo(listaArtefato.listaArtefato)
        imprimirListaTarefaFoo(listaArtefato.listaTarefaFoo)
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

                console.log(foo(artefatoFoo.tipoAlteracao,
                    artefatoFoo.numeroAlteracao, artefatoFoo.nomeArtefato))
            })

            console.log('')
        })
    }

    function foo(tipoAlteracao, numeroAlteracao, nomeArtefato) {

        let retorno = tipoAlteracao + '\t'

        params.mostrarNumModificacao && (
            retorno = retorno.concat(numeroAlteracao + '\t'))
        
        retorno = retorno.concat(nomeArtefato)

        return retorno
    }
}