#!/bin/bash

set -euo pipefail

echo "--- :bazel: build"
# build everything that has a testonly property
# those targets should be built with the bazel test command
bazel query 'attr(testonly, 0, //...)' | xargs bazel build
