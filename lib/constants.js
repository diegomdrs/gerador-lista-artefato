module.exports = Object.freeze({

    TIPO_MODIFICACAO: {
        ADDED: 'A',
        MODIFIED: 'M',
        RENAMED: 'R',
        DELETED: 'D'
    },

    // path.basename()
    TIPO_FILENAME_ARTEFATO: {   
        JAVA_RESOURCE: {regex: /.*resource.*\.java$/gi},
        JAVA_GATEWAY: {regex: /.*gateway.*\.java$/gi},
        JS_CONFIG: {regex: /.*(karma|gruntfile).*\.js$/gi}
    }
});