FROM mcr.microsoft.com/vscode/devcontainers/base:bullseye

ARG USERNAME=vscode
ARG USER_HOME=/home/${USERNAME}
ARG WORKSPACE_HOME=/workspaces/postgres-backup-tool

RUN apt-get update && apt-get -y install lsb-release

# Configure the Eclipse Adoptium apt repository.
RUN mkdir -p /etc/apt/keyrings
RUN wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | tee /etc/apt/keyrings/adoptium.asc
RUN echo \
  "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb \
   $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | tee /etc/apt/sources.list.d/adoptium.list

# Configure the Docker’s official apt repository.
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Configure the PostgreSQL apt repository.
RUN curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg
RUN echo \
  "deb [signed-by=/etc/apt/trusted.gpg.d/apt.postgresql.org.gpg] http://apt.postgresql.org/pub/repos/apt \
  $(lsb_release -cs)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list > /dev/null

RUN apt-get update && apt-get -y install --no-install-recommends \
    sshpass \
    chromium \
    chromium-sandbox \
    chromium-driver \
    temurin-17-jdk \
    docker-ce-cli \
    maven \
    postgresql-client-15

# Apt cleanup
RUN apt-get autoremove -y; \
    apt-get clean -y; \
    rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN=/usr/bin/chromium
