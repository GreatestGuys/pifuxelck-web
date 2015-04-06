#!/bin/bash

Color_Off='\e[0m'
BGreen='\e[1;32m'
BYellow='\e[1;33m'
BWhite='\e[1;37m'

if [[ $# -ne 1 ]] ; then
  echo 'usage: ./deploy sauce-user-name'
  exit 1
fi

USER=$1

echo -e "${BWhite}[+] ${BYellow}Removing previous deployment...${Color_Off}"
ssh \
  $USER@everythingissauce.com \
  "sudo su -c 'rm -Rf /srv/pifuxelck-web/*' pifuxelck-web"

echo -e "${BWhite}[+] ${BYellow}Copying new deployment...${Color_Off}"
scp \
  out/dist/* \
  $USER@everythingissauce.com:/srv/pifuxelck-web/

echo -e "${BWhite}[+] ${BGreen}All done!${Color_Off}"
exit 0
