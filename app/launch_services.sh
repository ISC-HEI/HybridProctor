#!/bin/bash

dropbear -p 22 -E
echo "Starting SSH (dropbear)"

service nginx restart
echo "Starting Nginx"

npm start
echo "Starting HybridProctor"

