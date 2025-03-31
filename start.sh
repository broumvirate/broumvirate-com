#!/bin/sh

cd /home/ben/broumvirate-com
pm2 stop broumvirate-com
npm install
npm run build
pm2 start broumvirate-com