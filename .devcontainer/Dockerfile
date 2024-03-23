FROM mcr.microsoft.com/vscode/devcontainers/base:bullseye

ARG USERNAME=vscode
ARG USER_HOME=/home/${USERNAME}
ARG WORKSPACE_HOME=/workspaces/postgres-backup-tool

RUN apt-get update && apt-get -y install --no-install-recommends \
    chromium \
    chromium-sandbox \
    chromium-driver

# Apt cleanup
RUN apt-get autoremove -y; \
    apt-get clean -y; \
    rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN=/usr/bin/chromium
COPY .bashrc ${USER_HOME}
