# HybridProctor project

## Overview
This system provides a streamlined and secure platform for educators to administer examinations to students using their personal computers. 

The foundation of this system is a specialized [router](https://isc-hei.github.io/HybridProctor/router/index.html), which hosts the examination statement and any additional resources that the educator wishes to provide. Upon setup, students can connect to the router via WiFi, granting them access to a dedicated examination webpage while restricting them an internet access. 

From this webpage, students can download necessary resources and, upon completion, submit their work. The submitted files are then conveniently stored on the router, ready for educators to retrieve via SFTP.

![](./docs/img/Overview_diagram.svg)


## Guides

Setup guides to use or config the system are available in the [online documentation](https://isc-hei.github.io/HybridProctor/index.html)

## Technical infos

The whole webserver is packaged in a docker image and is currently published in [dockerhub](https://hub.docker.com/r/stevedevenes/hybridproctor-arm/tags). 

There is some helpers rules in the [makefile](makefile) to:
- Build the docker image, either for your current machine or for deploying in the router.
- Publish to dockerhub (to a private repo, so it should not work -> need to create public repo ?).
- Start a container locally for testing purpose.
- Connect to the container via Sftp.
- Generate the project documentation via mkdocs.

### Versioning

The project version can be updated in [app/package.json](app/package.json)
