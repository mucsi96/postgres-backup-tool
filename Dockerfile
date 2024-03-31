FROM maven:3-eclipse-temurin-21 as build-server

WORKDIR /workspace/server

COPY server/pom.xml ./
COPY server .

RUN mvn package -DskipTests -B -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM node:21 as build-client

WORKDIR /workspace/client

COPY client/package*.json ./
RUN npm install

COPY client .
RUN npm run build

FROM bellsoft/liberica-openjre-alpine-musl:22

VOLUME /tmp

ARG DEPENDENCY=/workspace/server/target/dependency

RUN apk add postgresql15-client

COPY --from=build-server ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build-server ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build-server ${DEPENDENCY}/BOOT-INF/classes /app
COPY --from=build-client /workspace/client/dist/**/*.html /app/templates
COPY --from=build-client /workspace/client/dist/**/*.js /app/static

ENTRYPOINT ["java", "-cp", "app:app/lib/*", "-Dspring.profiles.active=prod", "io.github.mucsi96.postgresbackuptool.App"]
