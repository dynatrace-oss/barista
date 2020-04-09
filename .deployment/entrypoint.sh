#!/bin/sh

echo "
---------------------------------------------------------
Welcome to the Barista Workspace! 🔥

You are currently working in:
$(pwd)
---------------------------------------------------------

"

if [ ! "$(sha1sum -c package-lock.sha1)" ]; then
  echo "⚠️ Need to install packages due to updated package-lock.json"
  # When the checksums are not matching perform an npm install
  npm ci --ignore-scripts
fi

# Run the command from the docker image
exec "$@"
