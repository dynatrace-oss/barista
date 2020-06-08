FROM ubuntu:18.04 as bazel-installed

RUN apt-get update && apt-get install -y curl gnupg git

RUN curl https://bazel.build/bazel-release.pub.gpg | apt-key add - \
&& echo "deb [arch=amd64] https://storage.googleapis.com/bazel-apt stable jdk1.8" | tee /etc/apt/sources.list.d/bazel.list \
&& apt-get update && apt-get install -y bazel openssl\
&& bazel --version \
&& openssl version

FROM bazel-installed as fetcher

WORKDIR /root/barista

ADD ./ ./

RUN ls && bazel sync --repository_cache=/root/repocache \
 && bazel info


FROM bazel-installed

WORKDIR /root/barista

COPY --from=fetcher /root/repocache /root/repocache

