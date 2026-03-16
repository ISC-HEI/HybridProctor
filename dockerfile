FROM arm32v7/node:22-slim

WORKDIR /app

COPY app/pages/out ./pages
COPY app/backend/dist ./dist
COPY app/backend/package.json app/backend/package-lock.json ./
COPY app/backend/.env.prod ./.env
COPY app/*.sh ./

ENV NODE_ENV=production
RUN npm ci --omit=dev --verbose

RUN apt-get update && apt-get install -y nginx openssh-server curl vim bash

RUN curl -w %{http_code} -sL -o /usr/local/bin/node-prune "https://gobinaries.com/binary/github.com/tj/node-prune?os=linux&arch=arm&version=v1.2.0" && chmod +x /usr/local/bin/node-prune
RUN node-prune /app

ENV NEXT_TELEMETRY_DISABLE=1

COPY proxy/nginx.conf /etc/nginx/nginx.conf
COPY proxy/default.conf /etc/nginx/sites-available/default
RUN nginx -t

EXPOSE 22 80 2222

RUN chmod +x /app/*.sh

ENV RESOURCE_FOLDER=/mount_point
RUN mkdir -p "$RESOURCE_FOLDER"
VOLUME $RESOURCE_FOLDER

RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh
COPY ssh/root_access_rsa.pub /root/.ssh/authorized_keys
RUN chmod 600 /root/.ssh/authorized_keys

ENV HOSTNAME=0.0.0.0

CMD ["/bin/sh", "-c", "/app/sftp.sh admin proctor2024 && /app/launch_services.sh"]
