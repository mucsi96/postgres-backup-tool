package io.github.mucsi96.postgresbackuptool.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Table {
  String name;
  int rowCount;
}
