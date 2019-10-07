# Run all tests
yarn bitbucket-tools:test && \
# Run the build
yarn bitbucket-tools:build && \
# Build the docker image
docker build -t docker.lab.dynatrace.org:6000/designops/angular-components-commit-message-validator:latest tools/bitbucket-tools/
