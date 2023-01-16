#!/bin/bash
echo "Setting MongoDB Enviroment Variables"
export MONGODB_USERNAME=root
export MONGODB_PASSWORD=secret
export MONGODB_URL=3.14.153.162
env | sort
