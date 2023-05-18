package io.github.mucsi96.postgresbackuptool.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.github.mucsi96.postgresbackuptool.model.Backup;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.waiters.S3Waiter;

@Service
public class BackupService {
  private final S3Client s3Client;
  private final String bucketName;

  public BackupService(S3Client s3Client,
      @Value("${s3.bucket}") String bucketName) {
    this.s3Client = s3Client;
    this.bucketName = bucketName;
  }

  public List<Backup> getBackups() {
    ListObjectsV2Response response;

    try {
      // https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_ListObjects_section.html
      response = s3Client.listObjectsV2(
          ListObjectsV2Request.builder().bucket(bucketName).build());
    } catch (NoSuchBucketException e) {
      return Collections.emptyList();
    }

    return response.contents().stream()
        .map(s3Object -> Backup.builder().name(s3Object.key())
            .lastModified(s3Object.lastModified()).size(s3Object.size())
            .totalRowCount(getTotalCountFromName(s3Object))
            .retentionPeriod(getRetentionPeriodFromName(s3Object)).build())
        .sorted((a, b) -> b.getLastModified().compareTo(a.getLastModified()))
        .toList();
  }

  public void createBackup(File dumpFile) {
    try {
      tryCreateBackup(dumpFile);
    } catch (NoSuchBucketException e) {
      S3Waiter s3Waiter = s3Client.waiter();
      // https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_CreateBucket_section.html
      s3Client.createBucket(
          CreateBucketRequest.builder().bucket(bucketName).build());
      s3Waiter.waitUntilBucketExists(
          HeadBucketRequest.builder().bucket(bucketName).build());
      tryCreateBackup(dumpFile);
    }
  }

  public File downloadBackup(String key) throws IOException {
    // https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_GetObject_section.html
    ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(
        GetObjectRequest.builder().bucket(bucketName).key(key).build());
    byte[] data = objectBytes.asByteArray();

    File dumpFile = new File(key);
    try (OutputStream os = new FileOutputStream(dumpFile)) {
      os.write(data);
    } catch (IOException e) {
      throw e;
    }

    return dumpFile;
  }

  void tryCreateBackup(File dumpFile) {
    // https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_PutObject_section.html
    s3Client.putObject(PutObjectRequest.builder().bucket(bucketName)
        .key(dumpFile.getName()).build(), RequestBody.fromFile(dumpFile));
  }

  private int getTotalCountFromName(S3Object s3Object) {
    return Integer.parseInt(s3Object.key().split("\\.")[1]);
  }

  private int getRetentionPeriodFromName(S3Object s3Object) {
    return Integer.parseInt(s3Object.key().split("\\.")[2]);
  }
}
