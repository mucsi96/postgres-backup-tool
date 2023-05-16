package io.github.mucsi96.postgresbackuptool.service;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import io.github.mucsi96.postgresbackuptool.model.Database;
import io.github.mucsi96.postgresbackuptool.model.Table;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DatabaseService {
  private final JdbcTemplate jdbcTemplate;

  public Database getDatabaseInfo() {
    List<Map<String, Object>> result = jdbcTemplate.queryForList(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");

    // .name(table.get("table_name"))
    // .rowCount(getTableRowCount(table.get("table_name")))

    List<Table> tables = result.stream().map(table -> {
      String tableName = (String) table.get("table_name");
      return Table.builder().name(tableName)
          .rowCount(getTableRowCount(tableName)).build();
    }).toList();

    int totalRowCount = tables.stream().reduce(0,
        (acc, table) -> acc + table.getRowCount(), (a, b) -> a + b);

    return Database.builder().tables(tables).totalRowCount(totalRowCount)
        .build();

  }

  private int getTableRowCount(String tableName) {
    Integer count = jdbcTemplate
        .queryForObject("SELECT COUNT(*) FROM " + tableName, Integer.class);

    return count != null ? count : 0;
  }
}
