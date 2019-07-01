#!/usr/bin/env bash

# publish
cd ./dist
tar -czvf cms-web.tar.gz .

#ssh root@xxx mkdir -p /www/cms
#ssh root@xxx rm -rf /www/cms/*
#scp xxx.tar.gz root@xxx:/work/www/cms
#ssh root@ 'cd /www/xxx && tar -xvf xxx.tar.gz'

mkdir -p /work/www/cms-web
rm -rf /work/www/cms-web/*
cp cms-web.tar.gz /work/www/cms-web
cd /work/www/cms-web && tar -xvf cms-web.tar.gz
