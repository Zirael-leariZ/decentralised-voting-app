FROM ubuntu:24.04

RUN apt update && apt install -y \
  curl git unzip build-essential \
  libssl-dev pkg-config \
  ca-certificates \
  nodejs npm

RUN curl -L https://foundry.paradigm.xyz | bash && \
    /root/.foundry/bin/foundryup

RUN npm install -g hardhat

RUN mkdir -p /root/.local/bin
ENV PATH="/root/.local/bin:/root/.foundry/bin:${PATH}"

RUN curl -SL https://install.vlayer.xyz | bash && \
    bash -i -c 'vlayerup'

WORKDIR /app

CMD ["bash"]
