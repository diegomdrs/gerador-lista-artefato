module.exports = Object.freeze({

    TIPO_MODIFICACAO: {
        ADDED: 'A',
        MODIFIED: 'M',
        RENAMED: 'R',
        DELETED: 'D'
    },

    TIPO_ARTEFATO: {
        
        JAVA_RESOURCE: {regex: /[a-z0-9\_\-]+resource+[a-z0-9\_\-]*\.java$/gi},

        // [a-z0-9\_\-]+resource+[a-z0-9\_\-]*\.java$
        // asdf/resourceasafsdfaeeeeeeeeeeeeeeeeeeee/asdfasdfasdfasdf--çç~fdasresourcejfasdhfkasdjfçdfasdfasdf.java NOK
        // asdf/resourceasafsdfaeeeeeeeeeeeeeeeeeeee/        resource.java NOK
        // asdf/resourceasafsdfaeeeeeeeeeeeeeeeeeeee/resource.java NOK

        // [^\/]+resource.*\.java$
        // asdf/resourceasafsdfaeeeeeeeeeeeeeeeeeeee/asdfasdfasdfasdf--çç~fdasresourcejfasdhfkasdjfçdfasdfasdf.java OK
        // asdf/resourceasafsdfaeeeeeeeeeeeeeeeeeeee/        resource.java OK
        // asdf/resourceasafsdfaeeeeeeeeeeeeeeeeeeee/resource.java NOK

        JAVA_GATEWAY: {regex: /[^\/]*gateway*\.java$/gi},

        JS_CONFIG: {regex: /(karma|gruntfile).*\.js$/gi},
        
        OUTRO: {}
    }
});