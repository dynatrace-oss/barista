#!/bin/sh

echo "
Welcome to the Barista Workspace! 🔥

You are currently working in: $(pwd)

"

echo " Copying files from checkout 🚂"
tar cf - . | pv | (cd /dynatrace || exit; tar xf -)

# Switch to the workspace repo inside the container
cd /dynatrace || exit
export PWD=/dynatrace

if [ ! "$(sha1sum -c -s package-lock.sha1)" ]; then
  echo "Need to install packages due to updated package-lock.json"
  # When the checksums are not matching perform an npm install
  npm ci
fi

if [ -z "$INTERNAL_ENVIRONMENT" ]; then
  echo "We are in an internal environment!"
  npm install @dynatrace/barista-icons @dynatrace/barista-fonts
fi


# Run the command from the docker image
exec "$@"
