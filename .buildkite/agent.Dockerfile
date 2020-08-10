FROM buildkite/agent:ubuntu

RUN apt-get update && \
    apt-get -y install curl gnupg && \
    curl -sL https://deb.nodesource.com/setup_14.x  | bash - && \
    apt-get -y install nodejs && \
    npm i -g @bazel/bazelisk

RUN bazel version
