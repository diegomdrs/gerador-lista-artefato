const path = require('path')

const Tarefa = require('../models/tarefa-por-tarefa')
const Artefato = require('../models/artefato-por-tarefa')
const ArtefatoSaida = require('../models/artefato-saida')
const SaidaVO = require('../models/saida-vo')
const Gerador = require('./gerador')

const { TIPO_ARTEFATO_POR_TAREFA } = require('./constants')

module.exports = class GeradorPorTarefa extends Gerador {

  constructor(params) {
    super(params)
  }

  async gerarListaArtefato() {
    try {
      await this.init()

      const listaArtefatoAgrupadoPorTarefa = this.agruparArtefatoPorTarefa(this.listaArquivo)
      const listaSaida = this.obterListaSaidaTarefa(listaArtefatoAgrupadoPorTarefa)

      return listaSaida

    } catch (error) {
      throw new Error(error.message)
    }
  }

  obterListaSaidaTarefa(listaArtefatoAgrupadoPorTarefa) {

    return listaArtefatoAgrupadoPorTarefa.reduce((accum, tarefa) => {
      for (const tipoArtefato of Object.values(TIPO_ARTEFATO_POR_TAREFA)) {

        const listaArtefatoPorTipo = tarefa.listaArtefato.filter(artefato => 
          artefato.tipoArtefato.tipo === tipoArtefato)

        if(listaArtefatoPorTipo && listaArtefatoPorTipo.length) {
          const novaTarefa = {...tarefa, listaArtefato: listaArtefatoPorTipo}
          const saida = this.obterSaida(novaTarefa)
          accum.push(saida)
        }
      }

      return accum
    }, [])
  }

  obterSaida(tarefa) {
    const saida = new SaidaVO()
    saida.listaNumeroTarefaSaida = [
      {
        numeroTarefa: tarefa.numeroTarefa,
        descricaoTarefa: tarefa.descricaoTarefa
      }
    ]
    const listaArtefatoSaida = []

    //  Filtra os projetos que estão na lista de artefatos que contem a tarefa do loop
    const listaProjeto = tarefa.listaArtefato.reduce((listaRetorno, artefato) => {
      listaRetorno.add(artefato.nomeProjeto)
      return listaRetorno
    }, new Set())

    for (const nomeProjeto of listaProjeto) {

      // Filtra os artefatos pelo nome do projeto
      const listaArtefatoPorProjeto = tarefa.listaArtefato.filter(
        artefato => artefato.nomeProjeto === nomeProjeto)

      // Filtra as extensões que estão na lista de artefatos que contem a tarefa do loop
      const listaTipoArtefato = listaArtefatoPorProjeto.reduce((listaRetorno, artefato) => {
        listaRetorno.add(artefato.tipoArtefato.tipo)
        return listaRetorno
      }, new Set())

      // Filtra os tipos de alteração
      const listaTipoAlteracao = listaArtefatoPorProjeto.reduce((listaRetorno, artefato) => {
        listaRetorno.add(artefato.tipoAlteracao)
        return listaRetorno
      }, new Set())

      // Ordena a saída conforme os tipos de arquivos
      for (const tipoAlteracao of listaTipoAlteracao) {
        for (const tipo of listaTipoArtefato) {
          const listaSaida = this.obterListaSaida(tipo, tipoAlteracao, listaArtefatoPorProjeto)
          listaArtefatoSaida.push.apply(listaArtefatoSaida, listaSaida)
        }
      }

      // Remove os duplicados
      saida.listaArtefatoSaida = listaArtefatoSaida.reduce((lista, artefato) => {
        const contemArtefato = lista.some(item => {
          return item.nomeAntigoArtefato === artefato.nomeAntigoArtefato &&
            item.nomeArtefato === artefato.nomeArtefato &&
            item.nomeNovoArtefato === artefato.nomeNovoArtefato &&
            item.numeroAlteracao === artefato.numeroAlteracao &&
            item.tipoAlteracao === artefato.tipoAlteracao
        })

        if (!contemArtefato)
          lista.push(artefato)

        return lista
      }, [])
    }

    return saida
  }

  obterListaSaida(tipo, tipoAlteracao, listaArtefatoPorProjeto) {

    const listaRetorno = []

    if (tipo !== TIPO_ARTEFATO_POR_TAREFA.OUTROS) {

      const listaAgrupamento = listaArtefatoPorProjeto.filter((artefato) =>
        artefato.tipoAlteracao === tipoAlteracao &&
        artefato.tipoArtefato.tipo === tipo &&
        artefato.tipoArtefato.tipo !== TIPO_ARTEFATO_POR_TAREFA.OUTROS
      )

      listaRetorno.push.apply(listaRetorno, this.obterListaArtefato(listaAgrupamento))

    } else {

      // Filtra as extensões que estão na lista de artefatos
      const listaExtensao = listaArtefatoPorProjeto.reduce((listaRetorno, artefato) => {
        listaRetorno.add(artefato.tipoArtefato.extensao)
        return listaRetorno
      }, new Set())

      for (const extensao of listaExtensao) {

        const listaArtefatoPorExtensao = listaArtefatoPorProjeto
          .filter((artefato) => artefato.tipoArtefato.extensao === extensao &&
            artefato.tipoAlteracao === tipoAlteracao &&
            artefato.tipoArtefato.tipo === TIPO_ARTEFATO_POR_TAREFA.OUTROS)

        listaRetorno.push.apply(listaRetorno, this.obterListaArtefato(listaArtefatoPorExtensao))
      }
    }

    return listaRetorno
  }

  obterListaArtefato(listaAgrupamento) {
    return listaAgrupamento.reduce((listaRetorno, artefato) => {
      const artf = new ArtefatoSaida({
        nomeArtefato: artefato.nomeArtefato,
        tipoAlteracao: artefato.tipoAlteracao,
        numeroAlteracao: artefato.numeroAlteracao,
        hash: artefato.hash
      })

      if (artefato.isTipoAlteracaoRenomear()) {
        artf.nomeNovoArtefato = artefato.nomeNovoArtefato
        artf.nomeAntigoArtefato = artefato.nomeAntigoArtefato
      }

      listaRetorno.push(artf)

      return listaRetorno
    }, [])
  }

  agruparArtefatoPorTarefa(listaArquivo) {

    return listaArquivo.reduce((listaTarefaRetorno, arquivoReduce) => {

      if (this.isArtefatoSeraAdicionado(arquivoReduce)) {

        const novoArtefato = new Artefato({
          nomeArtefato: arquivoReduce.nomeArquivo,
          nomeNovoArtefato: arquivoReduce.commit.nomeNovoArquivo,
          nomeAntigoArtefato: arquivoReduce.commit.nomeAntigoArquivo,
          tipoAlteracao: arquivoReduce.commit.tipoAlteracao,
          tipoArtefato: this.obterTipoArtefato(arquivoReduce.nomeArquivo, TIPO_ARTEFATO_POR_TAREFA),
          nomeProjeto: arquivoReduce.nomeProjeto,
          numeroAlteracao: 1,
          hash: arquivoReduce.commit.hash
        })

        const tarefaEncontrada = listaTarefaRetorno.find(tarefa =>
          tarefa.numeroTarefa === arquivoReduce.commit.numeroTarefa)

        if (!tarefaEncontrada) {

          const novaTarefa = new Tarefa({
            numeroTarefa: arquivoReduce.commit.numeroTarefa,
            descricaoTarefa: arquivoReduce.commit.descricaoTarefa,
            listaArtefato: [novoArtefato]
          })

          listaTarefaRetorno.push(novaTarefa)

        } else {

          let artefatoModificadoEncontrado = tarefaEncontrada.listaArtefato.find(artefato =>
            artefato.nomeArtefato === novoArtefato.nomeArtefato && artefato.isTipoAlteracaoModificacao()
          )

          if (artefatoModificadoEncontrado)
            artefatoModificadoEncontrado.numeroAlteracao += 1
          else
            tarefaEncontrada.listaArtefato.push(novoArtefato)
        }
      }

      return listaTarefaRetorno

    }, []).sort(this.ordenarListaTarefa)
  }

  ordenarListaTarefa(tarefaA, tarefaB) {
    return tarefaA.numeroTarefa.localeCompare(tarefaB.numeroTarefa)
  }
}