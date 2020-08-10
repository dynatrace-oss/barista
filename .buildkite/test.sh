#!/bin/bash

set -euo pipefail

echo "--- Test all the stuff"
bazel test //...
