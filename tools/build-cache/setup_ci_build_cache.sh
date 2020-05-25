#!/bin/bash

set +e

openssl aes-256-cbc -pbkdf2 -salt -a -d\
  -out cache-write-key.json \
  -in cache-write-key.json.enc \
  -pass pass:${BAZEL_REMOTE_CACHE_PASSWORD}
