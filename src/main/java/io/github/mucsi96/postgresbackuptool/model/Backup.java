package io.github.mucsi96.postgresbackuptool.model;

import java.time.Instant;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Backup {
  String name;
  Instant lastModified;
  long size;
  int totalRowCount;
  int retentionPeriod;
}
