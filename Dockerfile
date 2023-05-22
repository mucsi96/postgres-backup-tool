FROM maven:3.9-eclipse-temurin-17 as build

WORKDIR /workspace/app

COPY pom.xml .
COPY src src

RUN mvn install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM eclipse-temurin:17-jdk-alpine

VOLUME /tmp

ARG DEPENDENCY=/workspace/app/target/dependency

RUN apk add postgresql15-client

COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java", "-cp", "app:app/lib/*", "-Dspring.profiles.active=test", "io.github.mucsi96.postgresbackuptool.App"]