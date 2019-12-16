
module.exports = async function (params) {

    const gerador = require('../lib/gerador')(params)

    const listaFoo = await gerador.gerarListaArtefato()

    imprimirListaFoo(listaFoo)

    function imprimirListaFoo(listaFoo) {

        console.log('')

        for (const foo of listaFoo) {

            if (foo.listaNumTarefa.length === 1)
                console.log('Tarefa nº ' + foo.listaNumTarefa[0] + '\n')
            else if (foo.listaNumTarefa.length > 1) {
                console.log('Tarefas nº ' + foo.listaNumTarefa.join(', ') + '\n')
            }

            for (const artefato of foo.listaArtefatoFoo) {
                console.log(imprimirFoo(artefato.tipoAlteracao,
                    artefato.numeroAlteracao, artefato.nomeArtefato))
            }

            console.log('')
        }
    }

    function imprimirFoo(tipoAlteracao, numeroAlteracao, nomeArtefato) {

        let retorno = tipoAlteracao + '\t'

        params.mostrarNumModificacao && (
            retorno = retorno.concat(numeroAlteracao + '\t'))

        retorno = retorno.concat(nomeArtefato)

        return retorno
    }
}