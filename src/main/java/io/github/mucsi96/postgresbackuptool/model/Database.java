package io.github.mucsi96.postgresbackuptool.model;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Database {
  List<Table> tables;
  int totalRowCount;
}
