package io.github.mucsi96.postgresbackuptool;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.DeleteBucketRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.NONE)
public class BaseIntegrationTest {
  @Autowired
  WebDriver webDriver;

  @Autowired
  S3Client s3Client;

  @Autowired
  JdbcTemplate jdbcTemplate;

  @Value("${s3.bucket}")
  String bucketName;

  // @LocalServerPort
  // private int port;

  @BeforeEach
  public void beforeEach() {
    cleanupS3();
    cleanupDB();
  }

  private void cleanupDB() {
    List<String> tables = jdbcTemplate.queryForList(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        .stream().map(table -> (String) table.get("table_name")).toList();

    tables.stream().forEach(table -> jdbcTemplate
        .execute(String.format("DROP TABLE \"%s\" cascade;", table)));
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
}
