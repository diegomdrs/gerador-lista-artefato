module.exports = Object.freeze({

    PORT: 3333,
    HOST: 'localhost',

    TAMANHO_HASH_COMMIT: 10,

    TIPO_LISTAGEM: {
        POR_TAREFA: 'POR_TAREFA',
        POR_TIPO_ARTEFATO: 'POR_TIPO_ARTEFATO'
    },

    TIPO_MODIFICACAO: {
        ADDED: 'A',
        MODIFIED: 'M',
        RENAMED: 'R',
        DELETED: 'D'
    },

    TIPO_ARTEFATO: {
        JAVA_RESOURCE: [
            { regex: /.*resource.*\.java$/gi }
        ],
        JAVA_GATEWAY: [
            { regex: /.*gateway.*\.java$/gi }
        ],
        JS_CONFIG: [
            { regex: /.*(karma|gruntfile).*\.js$/gi }
        ],
        // Tem que ser sempre o último
        OUTROS: [
            { regex: /.+/g }
        ]
    },

    TIPO_ARTEFATO_POR_TAREFA: {
        // 5.26.2 - Elaboração de documentação README e documentos auxiliares da aplicação
        CLOUD_DOCUMENTACAO: [
            { regex: /.*\.md$/gi }
        ],
        // 5.26.3 - Construção/Alteração de arquivos requirements ou values para deploy no ambiente Cloud
        CLOUD_CONFIG: [
            { regex: /.*(requirements|values).*\.yaml$/gi }
        ],
        // 5.15.14 - Alteração de objetos de integração e negócio Node.js/GoLang/Kotlin
        OBJ_INTEGRACAO_CLOUD: [
            { regex: /package.json$/gi }
        ],
        // Tem que ser sempre o último
        OUTROS: [
            { regex: /.+/g }
        ]
    }
});