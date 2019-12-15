const gerador = require('../lib/gerador')
const exec = require('child_process').exec

function execInTestDir(command, cb) {
    exec(command, { cwd: __dirname }, cb)
}

describe('test foo', () => {

    beforeEach(function (done) {
        execInTestDir(__dirname + '/delete-repo.sh', function (error) {
            if (error) {
                return done(error)
            }
            execInTestDir(__dirname + '/create-repo.sh', done)
        })
    })

    it('test one', () => { 
        gerador({autor: 'diegomdrs'})
    })

    afterEach((done) => {
        execInTestDir(__dirname + '/delete-repo.sh', function () {
            done()
        })
    })
})