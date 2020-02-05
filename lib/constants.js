module.exports = Object.freeze({

    TIPO_MODIFICACAO: {
        ADDED: 'A',
        MODIFIED: 'M',
        RENAMED: 'R',
        DELETED: 'D'
    },

    TIPO_ARTEFATO: {
        JS: {regex: '*.js'},
        HTML: {regex: '*.html'},
        OUTRO: {}
    }
});