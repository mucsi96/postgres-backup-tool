package io.github.mucsi96.postgresbackuptool.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BackupRow {
  private String date;
  private String name;
  private int records;
  private String size;
  private int retention;
}
