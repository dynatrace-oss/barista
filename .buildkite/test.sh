#!/bin/bash

set -euo pipefail

echo "--- Test all the stuff"
# bazel test //...
echo "$BUILDKITE_PARALLEL_JOB"
echo "$BUILDKITE_PARALLEL_JOB_COUNT"
