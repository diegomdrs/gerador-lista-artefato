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
- -p: Lista de projetos do Git (podem ser passados vários projetos separados por espaço ou vírgula)
- -u: Usuário do Git
- -t: Lista de tarefas (podem ser passadas vários tarefas separadas por espaço ou vírgula)

### Exemplos de Uso

``` console
$ gerador-artefato.sh -p foo -u X1337 -t 900089

D       foo-api/src/main/java/br/com/foo/api/v1/foo/gateway/GatewayFoo.java
M       foo-api/src/main/java/br/com/foo/api/v1/foo/gateway/GatewayConsultarFoo.java
A       foo-api/src/main/java/br/com/foo/api/v1/foo/gateway/GatewayIncluirFoo.java
M       foo-estatico/Gruntfile.js
M       foo-estatico/karma.conf.js
M       foo-estatico/package.json

```

``` console
$ gerador-artefato.sh -d /kdi/git -p foo -p 'foo bar' -u X1337 -t '900089,900081'

Tarefa nº 900089

D       foo-api/src/main/java/br/com/foo/api/v1/foo/gateway/GatewayFoo.java
M       foo-api/src/main/java/br/com/foo/api/v1/foo/gateway/GatewayConsultarFoo.java
A       foo-api/src/main/java/br/com/foo/api/v1/foo/gateway/GatewayIncluirFoo.java
M       foo-estatico/Gruntfile.js
M       foo-estatico/karma.conf.js
M       foo-estatico/package.json
M       bar-estatico/package.json
D       bar-estatico/spec/app/spas/bar/altera-bar-controllers-spec.js
A       bar-estatico/src/app/componentes/base-controller.js

Tarefa n° 900081

M       foo-estatico/Gruntfile.js
M       foo-estatico/karma.conf.js

```
