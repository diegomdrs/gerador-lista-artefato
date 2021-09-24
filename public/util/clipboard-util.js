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

        textArea.value = listaSaida;
        textArea.select();

        document.execCommand("copy");
        document.body.removeChild(textArea);
    }

    function obterNumero(saida) {

        if (saida.listaArtefatoSaida.length === 1) {

            return saida.listaNumeroTarefaSaida.length

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

            const tdQuantidade = document.createElement('td')
            const tdArtefato = document.createElement('td')
            const tdTarefa = document.createElement('td')

            tdQuantidade.appendChild(document.createTextNode(obterNumero(saida)))

            const ulArtefato = obterUlListaArtefato(saida.listaArtefatoSaida)
            const ulTarefa = obterUlListaNumTarefa(saida.listaNumeroTarefaSaida)

            tdArtefato.appendChild(ulArtefato)
            tdTarefa.appendChild(ulTarefa)

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

    function obterUlListaNumTarefa(listaNumeroTarefaSaida) {

        const ulTarefa = document.createElement('ul')

        for (const tarefa of listaNumeroTarefaSaida) {
            const li = document.createElement('li')

            li.appendChild(document.createTextNode(`Tarefa nº ${tarefa}`))

            ulTarefa.appendChild(li)
        }

        return ulTarefa
    }
}