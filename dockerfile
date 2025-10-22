FROM arm32v7/node:22-slim

RUN apt-get update && apt-get install -y nginx openssh-server curl libatomic1 vim bash python3 make g++ findutils

COPY proxy/nginx.conf /etc/nginx/nginx.conf
COPY proxy/default.conf /etc/nginx/sites-available/default
RUN nginx -t

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

# Config ssh
RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh
COPY ssh/root_access_rsa.pub /root/.ssh/authorized_keys
RUN chmod 600 /root/.ssh/authorized_keys

# Ports exposés
EXPOSE 22 80 2222

# Commande de démarrage
CMD ["/bin/sh", "-c", "/app/sftp.sh admin proctor2024 && /app/launch_services.sh"]
