angular
    .module('geradorApp')
    .factory('clipboardUtil', clipboardUtil)

clipboardUtil.$inject = ['geradorConstants'];

function clipboardUtil(geradorConstants) {

    return {
        copiarTabelaClipboardTabulado: copiarTabelaClipboardTabulado,
        copiarTabelaClipboard: copiarTabelaClipboard
    }

    function copiarTabelaClipboard(listaSaida) {

        var textArea = document.createElement("textarea");
        document.body.appendChild(textArea);

        textArea.value = obterTextoListaSaida(listaSaida);
        textArea.select();

        document.execCommand("copy");
        document.body.removeChild(textArea);
    }

    function obterNumero(saida) {

        if (saida.listaArtefatoSaida.length === 1) {

            return saida.listaNumTarefaSaida.length

        } else {

            return saida.listaArtefatoSaida.length
        }
    }

    function copiarTabelaClipboardTabulado(listaSaida) {

        const range = document.createRange()
        const table = document.createElement("table");
        const tbody = document.createElement('tbody')

        for (const saida of listaSaida) {

            const tr = document.createElement('tr')

            // const tdAtividade = document.createElement('td')
            // const tdNada = document.createElement('td')
            const tdQuantidade = document.createElement('td')
            const tdArtefato = document.createElement('td')
            const tdTarefa = document.createElement('td')

            tdQuantidade.appendChild(document.createTextNode(obterNumero(saida)))
            // tdAtividade.appendChild(document.createTextNode(geradorConstants.TIPO_MODIFICACAO
            //     [saida.listaArtefatoSaida[0].tipoAlteracao]))

            const ulArtefato = obterUlListaArtefato(saida.listaArtefatoSaida)
            const ulTarefa = obterUlListaNumTarefa(saida.listaNumTarefaSaida)

            tdArtefato.appendChild(ulArtefato)
            tdTarefa.appendChild(ulTarefa)

            // tr.appendChild(tdAtividade)
            // tr.appendChild(tdNada)
            tr.appendChild(tdQuantidade)
            tr.appendChild(tdArtefato)
            tr.appendChild(tdTarefa)

            tbody.appendChild(tr)
        }

        table.appendChild(tbody);
        document.body.appendChild(table)

        range.selectNode(table)

        const sel = window.getSelection()

        sel.removeAllRanges()
        sel.addRange(range)

        document.execCommand("copy")
        document.body.removeChild(table)
    }

    function obterUlListaArtefato(listaArtefatoSaida) {

        const ulArtefato = document.createElement('ul')

        for (const artefato of listaArtefatoSaida) {
            const li = document.createElement('li')

            li.appendChild(document.createTextNode(artefato.nomeArtefato))

            ulArtefato.appendChild(li)
        }

        return ulArtefato
    }

    function obterUlListaNumTarefa(listaNumTarefaSaida) {

        const ulTarefa = document.createElement('ul')

        for (const tarefa of listaNumTarefaSaida) {
            const li = document.createElement('li')

            li.appendChild(document.createTextNode(`Tarefa nº ${tarefa}`))

            ulTarefa.appendChild(li)
        }

        return ulTarefa
    }

    function obterTextoListaSaida(listaSaida) {

        return listaSaida.reduce((saidaTexto, saida) => {

            if (saida.listaNumTarefaSaida.length === 1)
                saidaTexto = saidaTexto.concat(
                    `\nTarefa nº ${saida.listaNumTarefaSaida[0]}\n`)

            else if (saida.listaNumTarefaSaida.length > 1)
                saidaTexto = saidaTexto.concat(
                    `\nTarefas nº ${saida.listaNumTarefaSaida.join(', ')}\n`)

            for (const artefato of saida.listaArtefatoSaida)
                saidaTexto = saidaTexto.concat(obterListaArtefato(artefato))

            saidaTexto = saidaTexto.concat('\n')

            return saidaTexto
        },'')
    }

    function obterListaArtefato(artefato) {

        let retorno = `\n${artefato.tipoAlteracao}\t`

        if (artefato.tipoAlteracao === geradorConstants.TIPO_MODIFICACAO.RENAMED)
            retorno = retorno.concat(`${artefato.nomeAntigoArtefato}\t${artefato.nomeNovoArtefato}`)
        else 
            retorno = retorno.concat(artefato.nomeArtefato)

        return retorno
    }
}