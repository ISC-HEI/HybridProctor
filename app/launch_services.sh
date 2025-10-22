#!/bin/bash

# Start the SSH server
service ssh restart
echo "Starting SSH"

service nginx restart
echo "Starting Nginx"

# Start the nextjs server
npm start
echo "Starting nextjs"

