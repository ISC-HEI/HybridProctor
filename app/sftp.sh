#!/bin/bash

# Assign input arguments to variables
USERNAME=$1
PASSWORD=$2

# Create a new SFTP-only group
groupadd sftp_users

# Create a new user and set the password
useradd -m -g sftp_users -s /usr/sbin/nologin $USERNAME
echo "$USERNAME:$PASSWORD" | chpasswd

# Create a directory for the user's SFTP access (optional, if you want to keep this directory)
mkdir -p /home/$USERNAME/upload
chown root:root /home/$USERNAME
chown $USERNAME:sftp_users /home/$USERNAME/upload
chmod 755 /home/$USERNAME
chmod 755 /home/$USERNAME/upload

# Configure SSH server to enable SFTP-only access
echo -e "\nMatch User $USERNAME" >> /etc/ssh/sshd_config
echo "    ForceCommand internal-sftp" >> /etc/ssh/sshd_config
echo "    PasswordAuthentication yes" >> /etc/ssh/sshd_config
#echo "    ChrootDirectory /home/$USERNAME" >> /etc/ssh/sshd_config  # Commented out to allow full access to the machine
echo "    PermitTunnel no" >> /etc/ssh/sshd_config
echo "    AllowAgentForwarding no" >> /etc/ssh/sshd_config
echo "    AllowTcpForwarding no" >> /etc/ssh/sshd_config
echo "    X11Forwarding no" >> /etc/ssh/sshd_config

# Restart the SSH server to apply changes
service ssh restart

echo "SFTP server setup complete for user: $USERNAME"