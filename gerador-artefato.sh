#!/bin/bash

# ./gerador-artefato.sh -p crm-patrimonio -u c1282036 -t 900089
# ./gerador-artefato.sh -d /kdi/git -p crm-patrimonio -u c1282036 -t 900089

DIRETORIO_PROJETOS='/kdi/git'

gerarArtefato()
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

for DIRETORIO in $DIRETORIO_PROJETOS/$PROJETO*; do
    if [ -d $DIRETORIO ]; then
        gerarArtefato $DIRETORIO $USUARIO $TASK
    fi
done
