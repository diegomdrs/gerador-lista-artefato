angular
    .module('geradorApp')
    .constant('geradorConstants', {

        TIPO_MODIFICACAO: {
            A: 'Criado',
            M: 'Alterado',
            R: 'Renomeado',
            D: 'Deletado'
        }
    })
