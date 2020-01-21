angular
    .module('geradorApp')
    .factory('geradorUtil', geradorUtil)

geradorUtil.$inject = ['geradorConstants'];

function geradorUtil(geradorConstants) {

    return {

        copiarTabelaClipboard: function (listaSaida) {

            // https://codepen.io/rishabhp/pen/jAGjQV
            // https://stackoverflow.com/questions/33855641/copy-output-of-a-javascript-variable-to-the-clipboard

            const range = document.createRange()
            const table = document.createElement("table");
            const tbody = document.createElement('tbody')

            for (const saida of listaSaida) {

                const tr = document.createElement('tr')
                const tdAtividade = document.createElement('td')
                const tdArtefato = document.createElement('td')
                const tdTarefa = document.createElement('td')

                tdAtividade.appendChild(document.createTextNode(
                    geradorConstants.TIPO_MODIFICACAO[saida.listaArtefatoSaida[0].tipoAlteracao]))

                const ulArtefato = document.createElement('ul')

                for (const artefato of saida.listaArtefatoSaida) {
                    const li = document.createElement('li')

                    li.appendChild(document.createTextNode(artefato.nomeArtefato))

                    ulArtefato.appendChild(li)
                }

                const ulTarefa = document.createElement('ul')

                for (const tarefa of saida.listaNumTarefaSaida) {
                    const li = document.createElement('li')

                    li.appendChild(document.createTextNode(`Tarefa nº ${tarefa}`))

                    ulTarefa.appendChild(li)
                }

                tdArtefato.appendChild(ulArtefato)
                tdTarefa.appendChild(ulTarefa)

                tr.appendChild(tdAtividade)
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
    }
}