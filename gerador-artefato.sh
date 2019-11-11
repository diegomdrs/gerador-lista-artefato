#!/bin/bash

DIRETORIO_PROJETOS='/kdi/git'

gerarListaArtefato()
{
    git -C $1 log --author=$2 --all --name-status -C --grep=$3| tac | grep -E "^[A,M,C,D]\s|^R.*\s" | sort -u -k 2 | awk -F '\t' '{print $1 "\t'"$(basename $1)"'/" $2 }'
}

while getopts "d:p:t:u:" opt
do
   case "$opt" in
      d ) DIRETORIO_PROJETOS="$OPTARG" ;;
      p ) LISTAPROJETO=("${LISTAPROJETO[@]}" "$OPTARG") ;;
      t ) TASK="$OPTARG" ;;
      u ) USUARIO="$OPTARG" ;;
   esac
done

if [[ ! -z $LISTAPROJETO && ! -z $TASK && ! -z $USUARIO ]]; then 
    for PROJETO in "${LISTAPROJETO[@]}"
        do
            for DIRETORIO in $DIRETORIO_PROJETOS/$PROJETO*; do
            if [ -d $DIRETORIO ]; then
                gerarListaArtefato $DIRETORIO $USUARIO $TASK
            fi
        done
    done
fi
