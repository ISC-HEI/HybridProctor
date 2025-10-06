#!/bin/bash

# Start the SSH server
service ssh restart
echo "Starting SSH"


# Start the nextjs server
npm start
echo "Starting NGINX"

