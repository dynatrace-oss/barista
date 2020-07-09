FROM ubuntu:18.04 as bazel-installed

RUN apt-get update && apt-get install -y curl gnupg git

ARG bazel_version

RUN curl https://bazel.build/bazel-release.pub.gpg | apt-key add - \
&& echo "deb [arch=amd64] https://storage.googleapis.com/bazel-apt stable jdk1.8" | tee /etc/apt/sources.list.d/bazel.list \
&& apt-get update && apt-get install -y bazel-${bazel_version} openssl\
&& bazel-${bazel_version} --version \
&& openssl version

FROM bazel-installed as fetcher

WORKDIR /root/barista

ADD ./ ./

ARG bazel_version

RUN ls && bazel-${bazel_version} sync --repository_cache=/root/repocache \
 && bazel-${bazel_version} info


FROM bazel-installed

ARG bazel_version

WORKDIR /root/barista

RUN echo alias bazel=bazel-${bazel_version} > ~/.bashrc

COPY --from=fetcher /root/repocache /root/repocache

