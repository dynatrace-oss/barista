#!/bin/bash
# base ami `ami-00e5ebe843eca1e7f`

set -euox pipefail

# execute as sudo in home directory
# $ sudo su
# $ cd ~/

# Add yum repository for the official node.js website
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -

# Install nodejs
sudo yum install -y nodejs

# Make global node modules available
export NODE_PATH=/usr/lib/node_modules

# Install bazelisk
npm i -g @bazel/bazelisk

# Get the bazel binary
bazelBin=$(node -p "require('@bazel/bazelisk/bazelisk.js').getNativeBinary()")

# Provide the bazel binary globally. We don't want to access the binary
# through Node as it could result in limited memory.
sudo chmod a+x ${bazelBin}
bazel=$(which bazel)
rm -f ${bazel}
sudo ln -fs ${bazelBin} "${bazel}"

# then switch to buildkite-agent user
# $ sudo -su buildkite-agent
# $ cd ~/

echo "3.3.1" > .bazelversion

# display versions
node -v
npm -v
bazel version

# Optional clone barista repository
# git clone https://github.com/dynatrace-oss/barista.git

# add bazelrc.user
# with repocache and diskcache Optional

# run bazel info




# use ebs volume
# https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html
