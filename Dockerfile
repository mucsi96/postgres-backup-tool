FROM maven:3.9-eclipse-temurin-17 as build

WORKDIR /workspace/app

COPY pom.xml .
COPY src src

RUN mvn install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM debian:bullseye

WORKDIR /app

RUN apt-get update && apt-get -y install --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    lsb-release

# Configure the Eclipse Adoptium apt repository.
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://packages.adoptium.net/artifactory/api/gpg/key/public | tee /etc/apt/keyrings/adoptium.asc
RUN echo \
  "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb \
   $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | tee /etc/apt/sources.list.d/adoptium.list

# Configure the PostgreSQL apt repository.
RUN curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg
RUN echo \
  "deb [signed-by=/etc/apt/trusted.gpg.d/apt.postgresql.org.gpg] http://apt.postgresql.org/pub/repos/apt \
  $(lsb_release -cs)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list > /dev/null

RUN apt-get update && apt-get -y install --no-install-recommends \
    temurin-17-jdk \
    postgresql-client-15

# Apt cleanup
RUN apt-get autoremove -y; \
    apt-get clean -y; \
    rm -rf /var/lib/apt/lists/*

ARG DEPENDENCY=/workspace/app/target/dependency

COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java","-cp","app:app/lib/*","io.github.mucsi96.postgresbackuptool.App"]