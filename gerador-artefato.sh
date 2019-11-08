#!/bin/bash

# ./gerador-artefato.sh -d /foo/foo-api -u X1337 -t 900089

while getopts "d:u:t:" opt
do
   case "$opt" in
      d ) DIRETORIO_PROJETO="$OPTARG" ;;
      u ) USUARIO="$OPTARG" ;;
      t ) TASK="$OPTARG" ;;
   esac
done

gerarArtefato()
{
    if [ -d $1 ]; then
        git -C $1 log --author=$2 --all --name-status -C --grep=$3| tac | grep -E "^[A,M,C,D]\s|^R.*\s" | sort -u -k 2 | awk -F '\t' '{print $1 "\t'"$(basename $1)"'/" $2 }'
    fi
}

gerarArtefato $DIRETORIO_PROJETO $USUARIO $TASK
