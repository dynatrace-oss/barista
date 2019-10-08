# Run all tests
yarn bitbucket-tools:test && \
# Run the build
yarn bitbucket-tools:build && \
# Build the validator and labeler docker image
docker build -t docker.lab.dynatrace.org:6000/designops/angular-components-commit-message-validator:latest ./tools/bitbucket-tools/ -f tools/bitbucket-tools/validator.Dockerfile && \

# Build the auto-cherry-picker docker image
docker build -t docker.lab.dynatrace.org:6000/designops/angular-components-auto-cherry-picker:latest ./tools/bitbucket-tools/ -f tools/bitbucket-tools/cherrypicker.Dockerfile
