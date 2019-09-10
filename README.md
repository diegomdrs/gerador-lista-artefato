# Comando para listagem de artefatos do QAS

Comando para listar os artefatos incluídos/alterados/renomeados/removidos para geração do QAS da BBTS

--- shell

NUM_TASK=1044511 ; NOME_AUTHOR="Diego" ; PROJETO="crm-patrimonio" ; git -C /kdi/git/$PROJETO-estatico log --author=$NOME_AUTHOR --all --name-status -C --grep=$NUM_TASK| tac | grep -E "^[A,M,C,D]\s|^R.*\s" | sort -u -k 2 ; git -C "/kdi/git/$PROJETO-api" log --author=$NOME_AUTHOR --all --name-status -C --grep=$NUM_TASK| tac | grep -E "^[A,M,C,D]\s|^R.*\s" | sort -u -k 2

---

Onde:

- NUM_TASK: Número da tarefa do ALM
- NOME_AUTHOR: Nome/Matrícula do autor dos commits
- PROJETO: nome do projeto (ex. crm-patrimonio, rdc, apc)
