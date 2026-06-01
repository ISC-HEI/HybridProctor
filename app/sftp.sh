#!/bin/bash

USERNAME=$1
PASSWORD=$2

mkdir -p /home/admin/upload

mkdir -p /etc/dropbear
[ -f /etc/dropbear/dropbear_rsa_host_key ] \
  || dropbearkey -t rsa -f /etc/dropbear/dropbear_rsa_host_key
[ -f /etc/dropbear/dropbear_ecdsa_host_key ] \
  || dropbearkey -t ecdsa -f /etc/dropbear/dropbear_ecdsa_host_key

echo "SFTP server setup complete"
