# postgres-backup-tool
Simple PostgreSQL backup tool to S3 bucket with UI

![PostgreSQL backup tool screenshot](docs/postrgress-backup-tool-1.png)

Stack:
- Java 17
- Spring Boot 3
- Web Components
- Lit 2.x
- Java AWS SDK 2.x 

Required environment variables:
- `DB_BACKUP_ENDPOINT_URL`
- `DB_BACKUP_ACCESS_KEY_ID`
- `DB_BACKUP_SECRET_ACCESS_KEY`
- `DB_BACKUP_BUCKET`
- `POSTGRES_HOSTNAME`
- `POSTGRES_PORT`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `SPRING_ACTUATOR_PORT`

## References

https://github.com/kananindzya/hello-world-aws-sdk-r2/blob/master/src/main/java/com/example/aws/api/r2/App.java
https://github.com/esfandiar/vs-code-spring-boot-setup
