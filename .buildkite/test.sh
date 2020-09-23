#!/bin/bash

set -euo pipefail

python3 ./.buildkite/test.py

# shard_targets () {
#   array="$@"
#   echo $array
#   echo $(qsort "${@}")
# }


# echo "--- Test all the stuff"

# BUILDKITE_PARALLEL_JOB=0
# BUILDKITE_PARALLEL_JOB_COUNT=4

# # bazel test //...
# echo "$BUILDKITE_PARALLEL_JOB"
# echo "$BUILDKITE_PARALLEL_JOB_COUNT"

# tests=$()
# shard_targets $(bazel --nomaster_bazelrc --bazelrc=/dev/null query 'tests(//libs/fluid-elements/...)')

