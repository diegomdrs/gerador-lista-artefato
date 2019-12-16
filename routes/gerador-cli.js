
module.exports = async function (params) {

    const gerador = require('../lib/gerador')(params)

    const listaFoo = await gerador.gerarListaArtefato()

    imprimirListaFoo(listaFoo)

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

    function imprimirFoo(tipoAlteracao, numeroAlteracao, nomeArtefato) {

        let retorno = tipoAlteracao + '\t'

        params.mostrarNumModificacao && (
            retorno = retorno.concat(numeroAlteracao + '\t'))

        retorno = retorno.concat(nomeArtefato)

        return retorno
    }
}