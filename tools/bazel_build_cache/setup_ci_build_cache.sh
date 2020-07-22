#!/bin/bash

# The script should immediately exit if any command in the script fails.
set -e

# Forked pull requests have CIRCLE_BRANCH set to pull/XXX
if [[ "${CIRCLE_BRANCH}" =~ pull\/[0-9]+ ]]; then
  echo "Forked pull request no setup for upload to remote chache!"
  echo "build --remote_upload_local_results=false" >> ../../.circleci/bazel.rc
  exit 0
fi

if [ -z "${BAZEL_REMOTE_CACHE_PASSWORD}" ]; then
  echo "Please specify the \"BAZEL_REMOTE_CACHE_PASSWORD\" environment variable when setting up remote " \
      "cache"
  exit 1
fi

DIR=${BAZEL_BUILD_CACHE_FOLDER:-$(pwd)}

# Decode the GCP token that is needed to authenticate the Bazel remote execution.
openssl aes-256-cbc -salt -a -d\
  -out "${DIR}/cache-write-key.json" \
  -in "${DIR}/cache-write-key.json.enc" \
  -pass "pass:${BAZEL_REMOTE_CACHE_PASSWORD}"

echo "build --remote_upload_local_results=true" >> ../../.circleci/bazel.rc
