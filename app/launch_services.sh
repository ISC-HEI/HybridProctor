#!/bin/bash

# Start the nginx server
service nginx start
echo "Starting NGINX"

# Start the SSH server
service ssh restart
echo "Starting SSH"
