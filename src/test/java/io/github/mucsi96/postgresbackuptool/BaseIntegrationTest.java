package io.github.mucsi96.postgresbackuptool;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.Description;
import org.junit.runners.model.Statement;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
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

import io.github.mucsi96.postgresbackuptool.model.BackupRow;
import io.github.mucsi96.postgresbackuptool.model.TableRow;
import io.github.mucsi96.postgresbackuptool.utils.TableUtils;
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
  WebDriver webDriver;

  WebDriverWait wait;

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
    wait = new WebDriverWait(webDriver, Duration.ofSeconds(5));
    cleanupS3();
    cleanupDB();
    initDB();
    prepare.run();
    webDriver.get("http://localhost:" + port);
    wait.until(ExpectedConditions
        .visibilityOfElementLocated(By.tagName("app-header")));
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

  }

  public void takeScreenshot(String name) {
    File tmpFile = ((TakesScreenshot) webDriver)
        .getScreenshotAs(OutputType.FILE);
    File destFile = new File("screenshots/" + name + ".png");
    try {
      if (destFile.exists()) {
        destFile.delete();
      }
      FileUtils.moveFile(tmpFile, destFile);
    } catch (IOException e) {
      e.printStackTrace();
    }
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

  public List<BackupRow> getBackups() {
    WebElement table = webDriver.findElement(By.xpath(
        "//app-heading[contains(text(), \"Backups\")]/following-sibling::app-table"));
    return TableUtils.getRows(table,
        cells -> BackupRow.builder().date(cells.get(1).getText())
            .name(cells.get(2).getText())
            .records(Integer.parseInt(cells.get(3).getText()))
            .size(cells.get(4).getText())
            .retention(Integer.parseInt(cells.get(5).getText().split(" ")[0]))
            .build());
  }

  public List<TableRow> getDatabaseTables() {
    WebElement table = webDriver.findElement(By.xpath(
        "//app-heading[contains(text(), \"Tables\")]/following-sibling::app-table"));

    return TableUtils.getRows(table,
        cells -> TableRow.builder().name(cells.get(0).getText())
            .rows(Integer.parseInt(cells.get(1).getText())).build());
  }
}
