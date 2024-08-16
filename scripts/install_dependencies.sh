#!/bin/bash

brew update && brew upgrade && brew install libpq

cd client && npm install && cd ..