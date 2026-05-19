#!/bin/bash

service ssh restart
echo "Starting SSH"

service nginx restart
echo "Starting Nginx"

npm start
echo "Starting nextjs"

