#!/bin/bash

rollup -c && git add . && git commit -m $1 && npm version patch && git push && npm publish