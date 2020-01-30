module.exports = {

    obterExtensaoArquivo: (nomeArquivo) => {

        return nomeArquivo.split('.').pop()
    }
}