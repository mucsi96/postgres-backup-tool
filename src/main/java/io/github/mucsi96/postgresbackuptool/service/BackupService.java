package io.github.mucsi96.postgresbackuptool.service;

import java.io.File;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.github.mucsi96.postgresbackuptool.model.Backup;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;

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
        .toList();
  }

  void tryCreateBackup(File dumpFile) {
    s3Client.putObject(
        PutObjectRequest.builder().bucket(bucketName).key(dumpFile.getName()).build(),
        RequestBody.fromFile(dumpFile));
  }

  public void createBackup(File dumpFile) {
    try {
      tryCreateBackup(dumpFile);
    } catch(NoSuchBucketException e) {
      s3Client.createBucket(CreateBucketRequest.builder().bucket(bucketName).build());
      tryCreateBackup(dumpFile);
    }
  }

  private int getTotalCountFromName(S3Object s3Object) {
    return Integer.parseInt(s3Object.key().split("\\.")[1]);
  }

  private int getRetentionPeriodFromName(S3Object s3Object) {
    return Integer.parseInt(s3Object.key().split("\\.")[2]);
  }
}
