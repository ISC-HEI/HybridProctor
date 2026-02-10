---
tags:
- dev_guide
---

# Dev guide

This guide will help you understand how to develop on HybridProctor.

## Project overview

Since HybridProctor uses NextJS we can separate the project in two parts.

## Client-Side

These files are usually have .tsx extension. They are rendered by the clients. `src/lib/utils/hooks` also contains client-side code, although with .ts extension.

## Server-Side

These files are ran by the server. They can be found in `src/api`, `src/lib/services` and all `*.server.ts` files.

`src/instrumentation.ts` and `src/middleware.ts` also are server-side.

### Server actions

Server-side code cannot be ran directly in client-side files. You need server actions to do that.

Server actions are written in `*.server.ts` files as async named exports.

`*.server.ts` files need to have `'use server'` at the top.

!!! info
    NextJS Server Actions work by creating an endpoint that clients can call.

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
npm i --include=dev --verbose
```

### How to build

First, start docker if it is not already done :

```sh
sudo systemctl start docker
```

This project uses C/C++ bindings libraries (such as argon2) that need to be cross-compilated to ARM32v7 and/or ARM64v8.  

This is done using a container that will be invoked whenever it is needed :

```sh
sudo docker run --rm -it --privileged multiarch/qemu-user-static --reset -p yes
```

Next, you'll need to follow a strict order of makefile rules to be able to publish your latest changes 
correctly :  

```sh
make build

sudo make imageDev
sudo make publishDev
```

!!! note inline end "ARM64v8 Rules"
    Use `make imageDev64` and `make publishDev64` to build for ARM64.

You can now follow the [setup guide](../setup/index.md).

!!! info
    `make build` can be replaced by npm run build inside the app subdirectory.

## Dev environment

NextJS includes a development environment that can be used to run the app locally and have hot-reload.

The dev server can be started with :

```sh
npm run dev
```

???+ bug "React strict mode"
    In development mode, react uses "strict mode", this means
    that the component is mounted two times to ensure data integrity and
    other things. This can lead to some bugs like two simultaneous SSE connections and 
    multiple identical keys.
