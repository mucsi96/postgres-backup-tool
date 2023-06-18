package io.github.mucsi96.postgresbackuptool;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.logging.Level;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.time.Duration;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.DeleteBucketRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;

public class FirstTest {
  static WebDriver webDriver;
  static S3Client s3Client;
  static JdbcTemplate jdbcTemplate;
  static final String bucketName = System.getenv("DB_BACKUP_BUCKET");

  @LocalServerPort
  private int port;

  @BeforeAll
  public static void setup() {
    webDriver = getWebDriver();
    s3Client = getMockS3Client();
    jdbcTemplate = getJdbcTemplate();

    cleanupDB();
    cleanupS3();
  }

  @AfterAll
  public static void tearDown() {
    webDriver.close();
    s3Client.close();
  }

  private static void cleanupDB() {
    List<String> tables = jdbcTemplate.queryForList(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        .stream().map(table -> (String) table.get("table_name")).toList();

    tables.stream().forEach(table -> jdbcTemplate
        .execute(String.format("DROP TABLE \"%s\" cascade;", table)));
  }

  private static JdbcTemplate getJdbcTemplate() {
    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    dataSource.setUrl(String.format(
        "jdbc:postgresql://%s:%s/test-postgres-backup-tool",
        System.getenv("POSTGRES_HOSTNAME"), System.getenv("POSTGRES_PORT")));
    dataSource.setUsername(System.getenv("POSTGRES_USER"));
    dataSource.setPassword(System.getenv("POSTGRES_PASSWORD"));
    return new JdbcTemplate(dataSource);
  }

  private static WebDriver getWebDriver() {
    ChromeOptions options = new ChromeOptions().addArguments("--disable-gpu",
        "--no-sandbox", "--disable-dev-shm-usage", "--window-size=1920,1080",
        "--remote-allow-origins=*").setHeadless(true);

    ChromeDriver driver = new ChromeDriver(options);
    driver.setLogLevel(Level.WARNING);
    return driver;
  }

  private static S3Client getMockS3Client() {
    return S3Client.builder().region(Region.US_EAST_1)
        .credentialsProvider(StaticCredentialsProvider
            .create(AwsBasicCredentials.create("foo", "bar")))
        .serviceConfiguration(
            S3Configuration.builder().pathStyleAccessEnabled(true).build())
        .endpointOverride(URI.create("http://s3:9090")).build();
  }

  public static void takeScreenshot(String name) {
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

  private static void cleanupS3() {
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

  @Test
  public void first_test() {
    // https://github.com/findify/s3mock
    webDriver.get("http://localhost:8080");
    WebDriverWait wait = new WebDriverWait(webDriver, Duration.ofSeconds(5));
    wait.until(ExpectedConditions
        .visibilityOfElementLocated(By.tagName("app-header")));
    takeScreenshot("first_test");
  }
}
