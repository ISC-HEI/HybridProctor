---
tags:
- dev_guide
---

# Dev guide

This guide will help you understand how to develop on HybridProctor.

## Project overview

Since HybridProctor uses NextJS we can separate the project in two parts.

### Client-Side

These files are usually have .tsx extension. They are rendered by the clients. `src/lib/utils/hooks` also contains client-side code, although with .ts extension.

### Server-Side

These files are ran by the server. They can be found in `src/api`, `src/lib/services` and all `*.server.ts` files.

`src/instrumentation.ts` and `src/middleware.ts` also are server-side.

#### Server actions

Server-side code cannot be ran directly in client-side files. You need server actions to do that.

Server actions are written in `*.server.ts` files as async named exports.

`*.server.ts` files need to have `'use server'` at the top.

#### Services

The services are background-running singletons, this includes : Logging, Storage, SSE Management, Network Management.

## Build

The image is hosted on DockerHub, since it is bound to an account, normally Steve's, 
it is not possible to publish the image without his credentials.  

To be able to test your latest changes you'll need to have an account on DockerHub, create a "repository" 
and modify the makefile's "publishDev" rule to use your account and repository.

### How to build

First, start docker if it is not already done :

```sh
sudo systemctl start docker
```

This project uses C/C++ bindings libraries (such as better-sqlite) that need to be cross-compilated to ARMv7.  

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

    !!! info
        `make build` can be replaced by npm run build inside the app subdirectory.
