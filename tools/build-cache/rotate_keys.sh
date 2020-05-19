#!/bin/bash

set +e

ROTATOR_JSON=./rotator.json
PLAIN_WRITE_KEY=./cache-write-key.json
WRITE_CACHE_USER=barista-build-cache-write@dynatrace-barista.iam.gserviceaccount.com

# Decrypt rotator service account json
openssl aes-256-cbc -pbkdf2 -salt -a -d \
  -in rotator-key.json.enc \
  -out ${ROTATOR_JSON} -pass pass:${BAZEL_REMOTE_CACHE_PASSWORD}

gcloud auth activate-service-account --key-file ${ROTATOR_JSON}
rm -f ${ROTATOR_JSON}

# get existing key id
gcloud iam service-accounts keys list --iam-account ${WRITE_CACHE_USER} # | first column
#gcloud iam service-accounts keys delete ${EXISTING_RO_KEY}
#gcloud iam service-accounts keys create ./tools/build-cache/cache-read-key.json

#openssl aes-256-cbc -pbkdf2 -salt -a -d \
#  -in ${PLAIN_WRITE_KEY} \
#  -out ./tools/build-cache/cache-write-key.json.enc -pass pass:${KEY_ENC_PW}

#rm -f ${PLAIN_WRITE_KEY}

#gh pr create
