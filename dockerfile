FROM arm32v7/node:22-slim

RUN apt-get update && apt-get install -y openssh-server curl libatomic1 vim bash python3 make g++ findutils

WORKDIR /app

COPY app/.env.prod ./.env
COPY app/next.config.ts ./
COPY app/package*.json ./
COPY app/.next ./.next
COPY app/public ./public
COPY app/node_modules ./node_modules
COPY app/*.sh /app/

RUN chmod +x /app/*.sh
RUN npm install --platform=linux --arch=arm --target_arch=arm better-sqlite3

# Config de ressources
ENV RESOURCE_FOLDER=/mount_point
RUN mkdir -p "$RESOURCE_FOLDER"
VOLUME $RESOURCE_FOLDER

# Config SSH
RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh
COPY ssh_key/root_access_rsa.pub /root/.ssh/authorized_keys
RUN chmod 600 /root/.ssh/authorized_keys

# Ports exposés
EXPOSE 22 2222
EXPOSE 80 80

# Commande de démarrage
CMD ["/bin/sh", "-c", "/app/sftp.sh admin proctor2024 && /app/launch_services.sh"]
