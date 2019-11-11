# Comando para listagem de artefatos do QAS

Comando para listar os artefatos incluídos/alterados/renomeados/removidos para geração do QAS

## Para Linux

### Instalação

``` console

$ cp gerador-artefato.sh ~/.local/bin
$ chmod +x ~/.local/bin/gerador-artefato.sh

```

### Uso

``` console
$ gerador-artefato.sh -d /kdi/git -p foo -u X1337 -t 900089
```

Onde:

- -d: Diretório dos projetos (se for omitido, será usado /kdi/git)
- -p: Projeto do Git (podem ser passados vários projetos)
- -u: Usuário do Git
- -t: Tarefa

### Exemplos de Uso

``` console
# gerador-artefato.sh -p foo -u X1337 -t 900089
```

``` console
# gerador-artefato.sh -d /kdi/git -p foo -u X1337 -t 900089
```

``` console
# gerador-artefato.sh -d /kdi/git -p foo -p bar -u X1337 -t 900089
```
