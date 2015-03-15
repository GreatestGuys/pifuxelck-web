# pifuxelck-web

## Setup

The following will setup a development environment required to build the
pifuxelck web client.

    git clone https://github.com/GreatestGuys/pifuxelck-web.git
    cd pifuxelck-web
    git submodule init
    git submodule update

You will additionally need to install a SCSS compiler. If you are developing
from Ubuntu you can run the following:

    sudo apt-get install ruby-sass

## Building

The project uses a simple makefile to build a deployable web application.

To build a production deployment run the following:

    make

To build a development deployment run the following:

    DEBUG=1 make

Cleaning your intermediate files is accomplished by running:

    make clean
