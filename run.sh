#!/bin/sh
git pull && docker build -t $1 . && docker run -d --name $1 --restart=always $1