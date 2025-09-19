FROM node:24-alpine3.21

RUN apk add --no-cache openssh curl vim bash

WORKDIR /app

COPY app/package*.json ./
RUN npm i

COPY app/* /app
RUN chmod +x /app/*.sh

ENV RESOURCE_FOLDER=/mount_point
RUN mkdir -p "$RESOURCE_FOLDER"

VOLUME $RESOURCE_FOLDER

RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh
COPY ssh_key/root_access_rsa.pub /root/.ssh/authorized_keys
RUN chmod 600 /root/.ssh/authorized_keys

EXPOSE 22 2222

CMD ["/bin/sh", "-c", "/app/sftp.sh admin proctor2024 && /app/launch_services.sh && npm build && npm start"]
