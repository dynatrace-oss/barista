#!/bin/bash

# The script should immediately exit if any command in the script fails.
set -e

SCRIPT=$(readlink -f "$0")
DIR=$(dirname "$SCRIPT")

bazel_rc="${DIR}/../bazel.rc"

if [ -z "${BUILDKITE}" ]; then
  # no CI call
  exit 0
fi

if [ -z "${BAZEL_REMOTE_CACHE_PASSWORD}" ]; then
  echo "Please specify the \"BAZEL_REMOTE_CACHE_PASSWORD\" environment variable when setting up remote " \
      "cache"
  exit 1
fi

# Decode the GCP token that is needed to authenticate the Bazel remote execution.
openssl aes-256-cbc -salt -a -d\
  -out "${DIR}/bazel_cache" \
  -in "${DIR}/bazel_cache.enc" \
  -md sha1 \
  -pass "pass:${BAZEL_REMOTE_CACHE_PASSWORD}"

BAZEL_CACHE_DIR="${DIR/$(pwd)\//}"

cat ${DIR}/bazel_cache >> ${bazel_rc}

