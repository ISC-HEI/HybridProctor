FROM nginx

# Installing Node for the file downloads, a SFTP server for accessing the FS
RUN apt-get update && apt-get install -y openssh-server curl libatomic1 vim

ENV NODE_VERSION=16.13.0    
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

WORKDIR /app
COPY app/package*.json ./

RUN npm install

# Copy all the scripts that should be run at startup
COPY app/* /app

# Make the scripts executable
RUN chmod +x /app/*.sh

# Copy config file for nginx
COPY app/config/nginx.conf /etc/nginx/nginx.conf

# Create resources directory
ENV RESOURCE_FOLDER /mount_point
RUN mkdir "$RESOURCE_FOLDER" && chown nginx:nginx -R "$RESOURCE_FOLDER"
VOLUME $RESOURCE_FOLDER

# Create a new directory for the sshd authorized_keys file
RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh

# Copy the public key into the container
COPY ssh_key/root_access_rsa.pub /root/.ssh/authorized_keys

# Set the permissions for the authorized_keys file
RUN chmod 600 /root/.ssh/authorized_keys

EXPOSE 3000 3000
EXPOSE 22 2222
EXPOSE 80 80

RUN /app/sftp.sh admin proctor2024;

CMD /app/launch_services.sh; node /app/app.js
