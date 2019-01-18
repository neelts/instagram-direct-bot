#!/bin/sh
git pull && docker build -t $1 . && docker container stop $1 && docker container prune -f && docker run -d --name $1 --restart=always $1