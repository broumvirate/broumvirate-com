#!/bin/sh

cd /home/ben/broumvirate-com
pm2 stop broumvirate-com
yarn install
yarn build
pm2 start broumvirate-com