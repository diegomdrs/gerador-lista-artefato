const express = require('express')
const router = express.Router()
const gerador = require('../bin/gerador');

router.post('/gerador', gerador.gerarListaArtefato)

module.exports = router