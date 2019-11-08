#!/bin/bash

# ./gerador-artefato.sh -p foo -u X1337 -t 900089
# ./gerador-artefato.sh -d /kdi/git -p foo -u X1337 -t 900089

DIRETORIO_PROJETOS='/kdi/git'

gerarListaArtefato()
{
    git -C $1 log --author=$2 --all --name-status -C --grep=$3| tac | grep -E "^[A,M,C,D]\s|^R.*\s" | sort -u -k 2 | awk -F '\t' '{print $1 "\t'"$(basename $1)"'/" $2 }'
}

while getopts "d:p:t:u:" opt
do
   case "$opt" in
      d ) DIRETORIO_PROJETOS="$OPTARG" ;;
      p ) PROJETO="$OPTARG" ;;
      t ) TASK="$OPTARG" ;;
      u ) USUARIO="$OPTARG" ;;
   esac
done

if [[ ! -z $PROJETO && ! -z $TASK && ! -z $USUARIO ]]; then 
    for DIRETORIO in $DIRETORIO_PROJETOS/$PROJETO*; do
        if [ -d $DIRETORIO ]; then
            gerarListaArtefato $DIRETORIO $USUARIO $TASK
        fi
    done
fi
