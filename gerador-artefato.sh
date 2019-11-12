#!/bin/bash

DIRETORIO_PROJETOS='/kdi/git'

gerarListaArtefato()
{
    git -C $1 log --no-merges --author=$2 --all --name-status -C --grep=$3| tac | grep -E "^[A,M,C,D]\s|^R.*\s" | sort -u -k 2 | awk -F '\t' '{print $1 "\t'"$(basename $1)"'/" $2 }'
}

while getopts "d:p:t:u:" opt
do
   case "$opt" in
      d ) DIRETORIO_PROJETOS="$OPTARG" ;;
      p ) LISTAPROJETO="$OPTARG" ;;
      t ) LISTATASK="$OPTARG" ;;
      u ) USUARIO="$OPTARG" ;;
   esac
done

LISTAPROJETO=($(echo $LISTAPROJETO | tr ',' '\n'))
LISTATASK=($(echo $LISTATASK | tr ',' '\n'))

if [[ ! -z $LISTAPROJETO && ! -z $LISTATASK && ! -z $USUARIO ]]; then

    for TASK in "${LISTATASK[@]}"; do 

        TAMANHOLISTATASK=${#LISTATASK[@]}

        if [ $TAMANHOLISTATASK -gt 1 ]; then
            echo -e '\nTarefa nº '$TASK'\n' 
        fi

        for PROJETO in "${LISTAPROJETO[@]}"; do

            for DIRETORIO in $DIRETORIO_PROJETOS/$PROJETO*; do

                if [ -d $DIRETORIO ]; then
                    gerarListaArtefato $DIRETORIO $USUARIO $TASK
                fi
            done
        done
    done
fi
