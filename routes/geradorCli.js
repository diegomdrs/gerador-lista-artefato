
module.exports = function (app) {

    const Param = require('../models/param')

    app.post('/gerador', async function (req, resp) {

        const params = Param.getFromBody(req.body)
        const gerador = require('../bin/gerador')(params)

        resp.json(await gerador.gerarListaArtefato())
    })
}

function imprimirListaArtefato(listaArtefatoTarefaMesmoTipo, listaArtefatoTarefasIguais) {

    console.log('')

    imprimirListaArtefatoTarefaMesmoTipo(listaArtefatoTarefaMesmoTipo)
    imprimirListaArtefatoTarefasIguais(listaArtefatoTarefasIguais)
}

function imprimirListaArtefatoTarefaMesmoTipo(lista) {
    lista.forEach(artefato => {

        const tarefas = artefato.listaTarefa.reduce((accum, tarefa) => {
            accum.listaTarefa.push(tarefa.numTarefa)
            accum.totalModificacao += tarefa.numeroAlteracao

            return accum
        }, { totalModificacao: 0, listaTarefa: [] })

        console.log('Tarefas nº ' + tarefas.listaTarefa.join(', ') + '\n')
        console.log('M\t' +
            params.mostrarNumModificacao && tarefas.totalModificacao + '\t' +
            artefato.nomeArtefato + '\n')
    })
}

function imprimirListaArtefatoTarefasIguais(listaArtefatoUmaModificacao) {

    listaTarefaComSaida.forEach(tarefaParam => {

        console.log('Tarefa nº ' + tarefaParam + '\n')

        listaArtefatoUmaModificacao.forEach(artefato => {

            artefato.listaTarefa.filter(tarefa =>
                tarefa.numTarefa === tarefaParam).forEach(tarefa => {

                    console.log(tarefa.tipoAlteracao + '\t' +
                        params.mostrarNumModificacao && tarefa.numeroAlteracao + '\t' +
                        artefato.nomeArtefato)
                })
        })

        console.log('')
    })
}