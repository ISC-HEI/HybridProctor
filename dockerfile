FROM arm32v7/node:22-slim

ARG VERSION
RUN : "${VERSION:?VERSION is required}"

WORKDIR /app

COPY app/pages/dist ./pages
COPY app/backend/dist ./dist
COPY app/backend/package.json app/backend/package-lock.json ./
COPY app/backend/.env.container ./.env
COPY app/*.sh ./

ENV NODE_ENV=production
RUN npm ci --omit=dev --verbose
RUN npm version --no-git-tag-version $VERSION

COPY node-prune /usr/local/bin/node-prune
RUN chmod +x /usr/local/bin/node-prune && node-prune /app/node_modules

RUN apt-get update && apt-get install -y --no-install-recommends nginx dropbear openssh-sftp-server bash && rm -rf /var/lib/apt/lists/*

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
