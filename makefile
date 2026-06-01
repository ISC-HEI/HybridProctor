## This should correspond to your dockerhub username to be able to publish the image
USER_NAME = stevedevenes
DEV_NAME = enderastronaute
IMAGE_NAME = hybridproctor
VERSION := $(shell grep -oP '"version": "\K(.*?)(?=")' app/backend/package.json)
FULL_VERSION := $(shell git describe --tags --always --first-parent --dirty=.dev)
NODE_PRUNE_URL := https://gobinaries.com/binary/github.com/tj/node-prune?os=linux&arch=arm&version=v1.2.0
NODE_PRUNE_64_URL := https://gobinaries.com/binary/github.com/tj/node-prune?os=linux&arch=arm64&version=v1.2.0

CACHE_DIR := ./.buildx-cache

CURRENT_DIR := $(shell pwd)

version:
	@echo version: $(VERSION)

image:  ## Build docker image to test locally
#   --progress=plain is just to see the echo messages during the build
	@docker build --progress=plain -t $(IMAGE_NAME) .
	@echo 
	@echo ">>> Docker image created ($(IMAGE_NAME)). Start a container with 'make container'."

imageProd: ## Build docker image for Mikrotik armV7
	@docker buildx build --platform=linux/arm/v7 --output=type=docker -t $(USER_NAME)/$(IMAGE_NAME)-arm:$(VERSION) .
	@echo ">>> Docker image created ($(USER_NAME)/$(IMAGE_NAME)-arm:$(VERSION)). Push on dockerHub from Docker Desktop and then pull the image from the Mikrotik container manager."

imageDev: 
	@curl -sL -o node-prune "$(NODE_PRUNE_URL)"
	@docker buildx build \
		--platform=linux/arm/v7 \
		--build-arg VERSION=$(FULL_VERSION) \
		--output=type=docker -t $(DEV_NAME)/$(IMAGE_NAME)-arm-dev:$(VERSION) .
	@echo ">>> Docker image created ($(DEV_NAME)/$(IMAGE_NAME)-arm-dev:$(VERSION)). Push on dockerHub from Docker Desktop and then pull the image from the Mikrotik container manager."

imageDev64:
	@curl -sL -o node-prune "$(NODE_PRUNE_64_URL)"
	@docker buildx build \
		--platform=linux/arm64 \
		--build-arg VERSION=$(FULL_VERSION) \
		--output=type=docker -t $(DEV_NAME)/$(IMAGE_NAME)-arm-dev:$(VERSION)-arm64 -f dockerfile-arm64 .
	@echo ">>> Docker image created ($(DEV_NAME)/$(IMAGE_NAME)-arm-dev:$(VERSION)-arm64). Push on dockerHub from Docker Desktop and then pull the image from the Mikrotik container manager."

build:
	@cd app/pages && npm i && npm run build
	@cd app/backend && npm i && npm run build
	@echo ">>> Next builded."

publish: ## Push the docker image on dockerhub
	@docker image push $(USER_NAME)/$(IMAGE_NAME)-arm:$(VERSION)
	@docker tag $(USER_NAME)/$(IMAGE_NAME)-arm:$(VERSION) $(USER_NAME)/$(IMAGE_NAME)-arm:latest
	@docker image push $(USER_NAME)/$(IMAGE_NAME)-arm:latest

publishDev:
	@docker image push $(DEV_NAME)/$(IMAGE_NAME)-arm-dev:$(VERSION)
	@docker tag $(DEV_NAME)/$(IMAGE_NAME)-arm-dev:$(VERSION) $(DEV_NAME)/$(IMAGE_NAME)-arm-dev:latest
	@docker image push $(DEV_NAME)/$(IMAGE_NAME)-arm-dev:latest

publishDev64:
	@docker image push $(DEV_NAME)/$(IMAGE_NAME)-arm-dev:$(VERSION)-arm64
	@docker tag $(DEV_NAME)/$(IMAGE_NAME)-arm-dev:$(VERSION)-arm64 $(DEV_NAME)/$(IMAGE_NAME)-arm-dev:arm64-latest
	@docker image push $(DEV_NAME)/$(IMAGE_NAME)-arm-dev:arm64-latest

container: ## Start image as container
	@docker container rm -f $(IMAGE_NAME)
# docker run -p 3000:3000 --name $(IMAGE_NAME) -v $(CURRENT_DIR)/uploads:/usr/src/app/uploads $(IMAGE_NAME)
#docker run -p 3000:3000 --name $(IMAGE_NAME) -v $(CURRENT_DIR)/uploads:/uploads $(IMAGE_NAME)
	docker run -p 80:80 -p 2222:22 -p 3000:3000 --name $(IMAGE_NAME) -v $(CURRENT_DIR)/app/mount:/mount_point -v $(CURRENT_DIR)/app/uploads:/home/admin/upload $(IMAGE_NAME)

exploreContainer:
	@docker container rm -f $(IMAGE_NAME)
	@docker run -d --name=$(IMAGE_NAME) $(IMAGE_NAME) tail -f /dev/null
	@docker exec -it $(IMAGE_NAME) /bin/bash

connectSftp: ## Connect via sftp to container running locally
# password: proctor2024
	sftp -i ssh_key/root_access_rsa -P 2222 root@localhost

connectSftpProd: ## Connect via sftp to container running in Mikrotik router
	sftp -i ssh_key/root_access_rsa -P 2222 root@172.30.0.1

docs: ## Generate project docs
	mkdocs build

serveDocs: ## Serve project docs
	mkdocs serve

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; \
	{printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
