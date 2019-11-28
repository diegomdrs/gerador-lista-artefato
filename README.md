# Gerador de listagem de artefatos do QAS

Comando para listar os artefatos incluídos/alterados/renomeados para geração do QAS

## Pré-requisitos 

### Sistema

- Node.js versão mínima v10.15.2
- Git versão mínima v2.7.4

### Git

- Não utilizar espaços nos nomes dos arquivos
- Configurar corretamente as variáveis do Git `user.name` e `user.email` com matrícula e email
- Verificar se os merges estão sendo realizados de maneira correta
- Utilizar o comando `git mv` para renomear os artefatos

## Instalação

- Baixe o script `gerador-artefato.js` [aqui](https://raw.githubusercontent.com/diegomdrs/gerador-lista-artefato-qas/master/gerador-artefato.js) e salve no seu computador
- Abra um terminal e execute o script com o comando `node`

## Uso

### Linux

``` console
$ node gerador-artefato.js --diretorio=/kdi/git --projeto=foo-estatico,foo-api --autor=X1337 --task=900089,900081
```

### Windows

``` console
$ node gerador-artefato.js --diretorio=C:/kdi/git --projeto=foo-estatico,foo-api --autor=X1337 --task=900089,900081
```

#### Onde:

- --diretorio: Diretório raiz dos projetos Git
- --projeto: Lista de projetos Git (podem ser passados vários projetos separados por vírgula)
- --autor: Matrícula do autor dos commits
- --task: Lista de tarefas (podem ser passadas várias tarefas separadas por vírgula)

#### Paramêtros opcionais

- --mostrar-num-modificacao: Nº de modificações do artefato na tarefa ou tarefas
- --mostrar-deletados: Mostrar artefatos deletados na tarefa

## Saida do gerador

``` console
$ node gerador-artefato.js --diretorio=/kdi/git --projeto=foo-estatico,foo-api --autor=X1337 --task=900089,900081 --mostrar-deletados --mostrar-num-modificacao

Tarefa nº 900089

M   2   foo-api/src/main/java/br/com/foo/api/v1/foo/gateway/GatewayConsultarFoo.java
M   3   foo-api/src/main/java/br/com/foo/api/v1/foo/gateway/GatewayIncluirFoo.java
A   1   foo-api/src/main/java/br/com/foo/api/v1/foo/gateway/GatewayIncluirFoo.java
M   1   foo-estatico/Gruntfile.js
M   1   foo-estatico/karma.conf.js
M   1   foo-estatico/package.json
R   1   foo-estatico/foo.json foo-estatico/bar.json
D   1   foo-estatico/src/app/spas/foo/detalha-foo.tpl.html

```
Onde:

- Ação executada no artefato na tarefa - A (Added), M (Modified), R (Renamed) e D (Deleted)
- Nº de modificações do artefato na tarefa - se utilizado o parâmetro `--mostrar-num-modificacao`
- Caminho do artefato

## Exemplos de uso

``` console
$ node gerador-artefato.js --diretorio=/kdi/git --projeto=foo-estatico,foo-api --autor=X1337 --task=900077,900079

Tarefas nº 900077, 900079

M      foo-estatico/Gruntfile.js

Tarefa nº 900077

M      foo-estatico/src/app/spas/foo/inclusao-foo.tpl.html
A      foo-estatico/src/app/spas/foo/inclusao-foo.tpl.html
M      foo-estatico/src/app/spas/foo/altera-foo.tpl.html

Tarefa nº 900079

M       foo-api/pom.xml
M       foo-api/operacoes.xml

```
