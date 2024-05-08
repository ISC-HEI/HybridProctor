## This should correspond to your dockerhub username to be able to publish the image
USER_NAME = stevedevenes
IMAGE_NAME = hybridproctor

CURRENT_DIR := $(shell pwd)

image:  ## Build docker image to test locally
#   --progress=plain is just to see the echo messages during the build
	@docker build --progress=plain -t $(IMAGE_NAME) .
	@echo 
	@echo ">>> Docker image created ($(IMAGE_NAME)). Start a container with 'make container'."

imageProd: ## Build docker image for Mikrotik armV7
	@docker buildx build --platform=linux/arm/v7 --output=type=docker -t $(USER_NAME)/$(IMAGE_NAME)-arm:latest .
	@echo ">>> Docker image created ($(USER_NAME)/$(IMAGE_NAME)-arm:latest). Push on dockerHub from Docker Desktop and then pull the image from the Mikrotik container manager."

publish: ## Push the docker image on dockerhub
	@docker image push $(USER_NAME)/$(IMAGE_NAME)-arm:latest

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
	sftp -P 2222 admin@localhost

connectSftpProd: ## Connect via sftp to container running in Mikrotik router
	sftp -P 2222 admin@192.168.88.1

connectSftpProdWifi: ## Connect via sftp to container running in Mikrotik router
	sftp -P 2222 admin@10.0.0.1

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; \
	{printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help