#!/bin/sh

echo "
---------------------------------------------------------
Welcome to the Barista Workspace! 🔥
You are currently working in:
$(pwd)
---------------------------------------------------------

"

oldSha=$(cat ./package-lock.sha1)
currentSha="$(sha1sum ./package-lock.json)"

if [ "$oldSha" != "$currentSha" ]; then
  echo "⚠️ Need to install packages due to updated package-lock.json"
  # When the checksums are not matching perform an npm install
  npm ci --ignore-scripts
  echo "Successfully updated all packages!"
else
  echo "All packages are up to date! 🐙"
fi


# Run the command from the docker image
exec "$@"
