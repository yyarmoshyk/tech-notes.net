This repository contains empty jekyll so far.

Before doing any further steps, make sure to build the local image required to run other commands:
```bash
make build-image
```

It can be built, verified by running the following commands:
```bash
make build
make verify
```

The following will launch the jekyll locally in docker. The website will be available at http://localhost:4000
```bash
make run
```
