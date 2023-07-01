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
- `DB_BACKUP_ENDPOINT_URL` - AWS S3 endpoint url
- `DB_BACKUP_ACCESS_KEY_ID`
- `DB_BACKUP_SECRET_ACCESS_KEY`
- `DB_BACKUP_BUCKET`
- `DB_BACKUP_REGION` - AWS S3 region
- `POSTGRES_HOSTNAME`
- `POSTGRES_PORT`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `SPRING_ACTUATOR_PORT`

## Resources

- https://github.com/kananindzya/hello-world-aws-sdk-r2/blob/master/src/main/java/com/example/aws/api/r2/App.java
- https://github.com/esfandiar/vs-code-spring-boot-setup
- https://gist.github.com/valferon/4d6ebfa8a7f3d4e84085183609d10f14
- https://cwienczek.com/2020/06/simple-backup-of-postgres-database-in-kubernetes/
- https://developers.cloudflare.com/r2/examples/aws/boto3/
- https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html
- https://florianbuchner.com/kubernetes-curl-cronjob-for-internal-service/

- https://flowbite.com/docs/components/tables/
- https://hslpicker.com/

### Selenium

- https://github.com/selenium-webdriver-book/source
