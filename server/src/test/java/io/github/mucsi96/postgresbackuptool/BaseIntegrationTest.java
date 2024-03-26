package io.github.mucsi96.postgresbackuptool;

import java.nio.file.Paths;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.Description;
import org.junit.runners.model.Statement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.lifecycle.Startables;

import com.adobe.testing.s3mock.testcontainers.S3MockContainer;
import com.microsoft.playwright.Page;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.DeleteBucketRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.waiters.S3Waiter;

class DevContainerNetwork implements Network {

  @Override
  public String getId() {
    return System.getenv("DOCKER_NETWORK");
  }

  @Override
  public void close() {
  }

  @Override
  public Statement apply(Statement base, Description description) {
    return null;
  }

};

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ExtendWith(ScreenshotOnFailure.class)
public class BaseIntegrationTest {

  static S3MockContainer s3Mock;

  static PostgreSQLContainer<?> dbMock;

  @Autowired
  Page page;

  @Autowired
  S3Client s3Client;

  @Autowired
  JdbcTemplate jdbcTemplate;

  @Autowired
  DateTimeFormatter dateTimeFormatter;

  @Value("${s3.bucket}")
  String bucketName;

  @LocalServerPort
  private int port;

  @BeforeAll
  public static void setUp() {
    if (s3Mock != null) {
      return;
    }

    s3Mock = new S3MockContainer("2.13.0");
    dbMock = new PostgreSQLContainer<>("postgres:15.3-alpine3.18");

    if (System.getenv("DOCKER_NETWORK") != null) {
      Network network = new DevContainerNetwork();
      s3Mock.withNetwork(network);
      dbMock.withNetwork(network);
    }

    Startables.deepStart(List.of(dbMock, s3Mock)).join();
  }

  public void setupMocks(Runnable prepare) {
    cleanupS3();
    cleanupDB();
    initDB();
    prepare.run();
    page.navigate("http://localhost:" + port);
  }

  public void setupMocks() {
    setupMocks(() -> {
    });
  }

  @DynamicPropertySource
  public static void overrideProps(DynamicPropertyRegistry registry) {
    registry.add("s3.endpoint", () -> s3Mock.getHttpEndpoint());
    registry.add("s3.access-key", () -> "foo");
    registry.add("s3.secret-key", () -> "bar");
    registry.add("s3.bucket", () -> "test-bucket");
    registry.add("s3.region", () -> "test-region");
    registry.add("postgres.database-name", dbMock::getDatabaseName);
    registry.add("postgres.username", dbMock::getUsername);
    registry.add("postgres.root-url",
        () -> String.format("jdbc:postgresql://%s:%s/postgres",
            dbMock.getHost(), dbMock.getFirstMappedPort()));
    registry.add("postgres.connection-string",
        () -> String.format("postgresql://%s:%s@%s:%s/%s", dbMock.getUsername(),
            dbMock.getPassword(), dbMock.getHost(), dbMock.getFirstMappedPort(),
            dbMock.getDatabaseName()));
    registry.add("postgres.exclude-tables", () -> "passwords, secrets");
    registry.add("spring.datasource.type",
        () -> "org.springframework.jdbc.datasource.SimpleDriverDataSource");
    registry.add("spring.datasource.url", dbMock::getJdbcUrl);
    registry.add("spring.datasource.username", dbMock::getUsername);
    registry.add("spring.datasource.password", dbMock::getPassword);
  }

  public void cleanupDB() {
    List<String> tables = jdbcTemplate.queryForList(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        .stream().map(table -> (String) table.get("table_name")).toList();

    tables.stream().forEach(table -> jdbcTemplate
        .execute(String.format("DROP TABLE \"%s\" cascade;", table)));
  }

  public void initDB() {
    jdbcTemplate.execute("create table fruites (name varchar(20))");
    jdbcTemplate.execute("insert into fruites (name) values ('Apple')");
    jdbcTemplate.execute("insert into fruites (name) values ('Orange')");
    jdbcTemplate.execute("insert into fruites (name) values ('Banana')");
    jdbcTemplate.execute("insert into fruites (name) values ('Rasberry')");
    jdbcTemplate.execute("create table vegetables (name varchar(20))");
    jdbcTemplate.execute("insert into vegetables (name) values ('Carrot')");
    jdbcTemplate.execute("insert into vegetables (name) values ('Potato')");
    jdbcTemplate.execute("insert into vegetables (name) values ('Spinach')");
    jdbcTemplate.execute("insert into vegetables (name) values ('Broccoli')");
    jdbcTemplate.execute("insert into vegetables (name) values ('Tomato')");
    jdbcTemplate.execute("create table passwords (name varchar(20))");
    jdbcTemplate.execute("insert into passwords (name) values ('123')");
    jdbcTemplate.execute("insert into passwords (name) values ('123456')");
    jdbcTemplate.execute("insert into passwords (name) values ('abc')");
    jdbcTemplate.execute("insert into passwords (name) values ('abcd')");
    jdbcTemplate.execute("create table secrets (name varchar(20))");
    jdbcTemplate.execute("insert into secrets (name) values ('a')");
    jdbcTemplate.execute("insert into secrets (name) values ('b')");
    jdbcTemplate.execute("insert into secrets (name) values ('c')");
  }

  public void takeScreenshot(String name) {
    page.screenshot(new Page.ScreenshotOptions()
        .setPath(Paths.get("screenshots/" + name + ".png")));
  }

  private void cleanupS3() {
    try {
      // https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_ListObjects_section.html
      List<ObjectIdentifier> objects = s3Client
          .listObjectsV2(
              ListObjectsV2Request.builder().bucket(bucketName).build())
          .contents().stream()
          .map((object) -> ObjectIdentifier.builder().key(object.key()).build())
          .toList();
      s3Client.deleteObjects(DeleteObjectsRequest.builder().bucket(bucketName)
          .delete(Delete.builder().objects(objects).build()).build());
      s3Client.deleteBucket(
          DeleteBucketRequest.builder().bucket(bucketName).build());
    } catch (NoSuchBucketException e) {
    }
  }

  public void createMockBackup(Instant time, int rowCount,
      int retentionPeriod) {
    String timeString = dateTimeFormatter.format(time);
    String filename = String.format("%s.%s.%s.pgdump", timeString, rowCount,
        retentionPeriod);
    try {
      s3Client
          .headBucket(HeadBucketRequest.builder().bucket(bucketName).build());
    } catch (NoSuchBucketException e) {
      s3Client.createBucket(
          CreateBucketRequest.builder().bucket(bucketName).build());
      S3Waiter s3Waiter = s3Client.waiter();
      s3Waiter.waitUntilBucketExists(
          HeadBucketRequest.builder().bucket(bucketName).build());
    }

    s3Client.putObject(
        PutObjectRequest.builder().bucket(bucketName).key(filename).build(),
        RequestBody.empty());
  }
}
