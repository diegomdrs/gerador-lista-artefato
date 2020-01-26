angular
    .module('geradorApp')
    .constant('geradorConstants', {

        // TODO - ver isso aqui
        TIPO_FOO: {
            DEFAULT: "DEFAULT", 
            TOP: "TOP"
        },

        TIPO_MODIFICACAO: {
            A: 'Criado',
            M: 'Alterado',
            R: 'Renomeado',
            D: 'Deletado'
        },

        TIPO_ALERTA: {
            SUCCESS: { class: 'alert-success', icone: '✓' },
            ERROR: { class: 'alert-danger', icone: '✗' },
        },

        TIMEOUT_ALERTA: 4000
    })