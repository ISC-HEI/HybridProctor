---
tags:
- dev_guide
---

# Dev guide

This guide is intended to assist developers.

## Project Overview

HybridProctor is made using two different technologies, NextJS for the frontend and ExpressJS for the backend.

## Frontend

NextJS uses a directory-based routing system. This means that each subdirectory in the `src/app` directory is a subpath, i.e `src/app/admin/monitor/page.tsx` will generate `/admin/monitor`.

## Backend

The backend router is also pseudo-directory-based to match the NextJS router.

ExpressJS uses middlewares to parse data. If a mime-type isn't currently supported you just need to add the required module and add `app.use(the_parser)` in `src/app.ts`.

### Services

The modules in `src/lib/services/` are background-running singletons. This includes : Logging, storage, SSE management, network management.

#### Logging

The `logger.ts` file provides you a centralized way to log. It writes the logfiles and broadcasts the logs via SSE

#### SSE

The `sse.ts` file manages SSE clients and handles disconnections and data transmission.

#### Storage

The `storage.ts` file is an I/O manager that stores important data such as the password, time offset, etc...

#### Network

The `network.ts` file manages students and handles connections and disconnections via the heartbeat endpoint. It also periodically sends updates via SSE.

## Build

The image is hosted on DockerHub. Since the image is bound to Steve's account, it is not possible to publish the image without his credentials.

To test your latest changes ,create a DockerHub account, a repository, and modify the makefile's "publishDev" and "publishDev64" rules to use your account and repository.

### Install dependencies

```sh
npm i
```

### How to build for Docker

First, start docker if it is not already done :

```sh
sudo systemctl start docker
```

This project may use C/C++ bindings in some libraries. They need to be cross-compilated to ARM32v7 and/or ARM64v8.  

This is done using a container that installs the required QEMU CPU architectures.

```sh
docker run --privileged --rm tonistiigi/binfmt --install all
```

!!! note
    This command may need to be run every time you reboot.

Next, you'll need to follow a strict order of Makefile rules to be able to publish your latest changes correctly :  

```sh
make build

sudo make imageDev
sudo make publishDev
```

!!! note inline end "ARM64v8 Rules"
    Use `make imageDev64` and `make publishDev64` to build for ARM64.

!!! info
    `make build` can be replaced by npm run build inside the app subdirectory.

### How to build for a native environment

The entire pipeline is done via a GitHub workflow. You just need to add a new tag and push it :

```sh
npm version vX.X.X
git push && git push --tags
```

!!! tip
    You can add a tag to a specific commit/branch if you forgot to do so.  
    This can be done by adding the checksum of the desired commit after the command.

!!! failure
    The workflow currently doesn't build/publish the Docker images. This needs to be done manually.

You can now follow the [setup guide](../setup/index.md).

## Dev environment

The backend includes a development environment that can be used to run the app locally without bundling it.

The dev server can be started with :

```sh
npm run dev
```
