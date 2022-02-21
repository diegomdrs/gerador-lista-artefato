module.exports = Object.freeze({

    PORT: 3333,
    HOST: 'localhost',

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
        // 5.26.1 - Elaboração de documento de arquitetura da aplicação Cloud 
        CLOUD_DOCUMENTATION: [
            { regex: /.*\.md$/gi }
        ],
        // 5.26.3 - Elaboração de documento de arquitetura da aplicação Cloud
        CLOUD_CONFIG: [
            { regex: /.*(values|requirements).*\.yaml$/gi }
        ],
        // Tem que ser sempre o último
        OUTROS: [
            { regex: /.+/g }
        ]
    }
});