#!/bin/bash

set +e

openssl aes-256-cbc -pbkdf2 -salt -a -d\
  -out $(pwd)/cache-write-key.json \
  -in $(pwd)/cache-write-key.json.enc \
  -pass pass:${BAZEL_REMOTE_CACHE_PASSWORD}
