---
tags:
- dev_guide
---

# Dev guide

This guide will help you understand how to develop on HybridProctor.

## Project overview

HybridProctor is made using two different technologies, NextJS for the frontend and ExpressJS for the backend.

## Frontend

NextJS uses a directory-based routing system, this means that each subdirectory in `src/app` is a subpath. i.e `src/app/admin/monitor/page.tsx` will generate `/admin/monitor`.

## backend

The backend router is also pseudo-directory-based to match NextJS' router.

ExpressJS uses middlewares for parsing data. This means that if a mime-type isn't currently supported you just need to add the required module and add `app.use(the_parser)` in `src/app.ts`.

### Services

`src/lib/services/` are background-running singletons, this includes : Logging, Storage, SSE Management, Network Management.

#### Logging

`logger.ts` gives you a centralized way to log. It writes the logfiles and broadcasts the logs via SSE

#### SSE

`sse.ts` manages SSE clients, it handles disconnections and sending data.

#### Storage

`storage.ts` is an IO manager and it stores important data such as the password, time offset, etc...

#### Network

`network.ts` manages students, it handles connections and disconnections via the heartbeat endpoint. It also periodically send updates via SSE.

## Build

The image is hosted on DockerHub, since it is bound to an account, normally Steve's, 
it is not possible to publish the image without his credentials.  

To be able to test your latest changes you'll need to have an account on DockerHub, create a "repository" 
and modify the makefile's "publishDev" and "publishDev64" rules to use your account and repository.

### Install dependencies

```sh
npm i
```

### How to build

First, start docker if it is not already done :

```sh
sudo systemctl start docker
```

This project may use C/C++ bindings libraries that need to be cross-compilated to ARM32v7 and/or ARM64v8.  

This is done using a container that will install the required QEMU CPU architectures.

```sh
docker run --privileged --rm tonistiigi/binfmt --install all
```

!!! note
    This command may need to be ran every reboot.

Next, you'll need to follow a strict order of makefile rules to be able to publish your latest changes 
correctly :  

```sh
make build

sudo make imageDev
sudo make publishDev
```

!!! note inline end "ARM64v8 Rules"
    Use `make imageDev64` and `make publishDev64` to build for ARM64.

!!! info
    `make build` can be replaced by npm run build inside the app subdirectory.

You can now follow the [setup guide](../setup/index.md).

## Dev environment

The backend includes a development environment that can be used to run the app locally without bundling it.

The dev server can be started with :

```sh
npm run dev
```
