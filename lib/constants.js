module.exports = Object.freeze({

    TIPO_MODIFICACAO: {
        ADDED: 'A',
        MODIFIED: 'M',
        RENAMED: 'R',
        DELETED: 'D'
    },

    TIPO_ARTEFATO: {
        JAVA_RESOURCE: {regex: /[a-z0-9\_\-]+resource+[a-z0-9\_\-]+\.java$/gi},
        JAVA_GATEWAY: {regex: /[a-z0-9\_\-]+gateway+[a-z0-9\_\-]+\.java$/gi},
        JS_CONFIG: {regex: /(karma|gruntfile)\.js$/gi},
        OUTRO: {}
    }
});