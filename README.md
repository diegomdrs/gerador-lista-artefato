# Comando para listagem de artefatos do QAS

Comando para listar os artefatos incluídos/alterados/renomeados/removidos para geração do QAS

## Para Linux

``` console

NUM_TASK=1337 ; NOME_AUTHOR="Fulano" ; PROJETO="foo" ; git -C /kdi/git/$PROJETO-estatico log --author=$NOME_AUTHOR --all --name-status -C --grep=$NUM_TASK| tac | grep -E "^[A,M,C,D]\s|^R.*\s" | sort -u -k 2 | awk -F '\t' '{print $1 "\t'"$PROJETO"'-estatico/" $2 }' ; git -C /kdi/git/$PROJETO-api log --author=$NOME_AUTHOR --all --name-status -C --grep=$NUM_TASK| tac | grep -E "^[A,M,C,D]\s|^R.*\s" | sort -u -k 2 | awk -F '\t' '{print $1 "\t'"$PROJETO"'-api/" $2 }'

```

Onde:

- NUM_TASK: Número da tarefa
- NOME_AUTHOR: Nome/Matrícula do autor dos commits
- PROJETO: nome do projeto (ex. foo, bar)
