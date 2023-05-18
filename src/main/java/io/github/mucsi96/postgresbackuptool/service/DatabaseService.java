package io.github.mucsi96.postgresbackuptool.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import io.github.mucsi96.postgresbackuptool.model.Database;
import io.github.mucsi96.postgresbackuptool.model.Table;

@Service
public class DatabaseService {
  private final JdbcTemplate jdbcTemplate;
  private final String connectionString;

  public DatabaseService(JdbcTemplate jdbcTemplate,
      @Value("${postgres.connection-string}") String connectionString) {
    this.jdbcTemplate = jdbcTemplate;
    this.connectionString = connectionString;
  }

  public Database getDatabaseInfo() {
    List<Map<String, Object>> result = jdbcTemplate.queryForList(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");

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

  public File createDump(int retentionPeriod)
      throws IOException, InterruptedException {
    String timeString = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")
        .format(LocalDateTime.now().toInstant(ZoneOffset.UTC));
    String filename = String.format("%s.%s.%s.pgdump", timeString,
        getDatabaseInfo().getTotalRowCount(), retentionPeriod);
    Process process = new ProcessBuilder("pg_dump", "--dbname",
        connectionString, "--format", "c", "--file", filename).inheritIO()
            .start();
    int exitCode = process.waitFor();
    if (exitCode != 0) {
      throw new RuntimeException("pg_dump returned " + exitCode);
    }

    return new File(filename);
  }

  public void restoreDump(File dumpFile)
      throws IOException, InterruptedException {
    Process process = new ProcessBuilder("pg_restore", "--clean", "--create",
        "--dbname", connectionString, "--verbose", dumpFile.getName())
            .inheritIO().start();
    process.waitFor();
  }

  private int getTableRowCount(String tableName) {
    Integer count = jdbcTemplate
        .queryForObject("SELECT COUNT(*) FROM " + tableName, Integer.class);

    return count != null ? count : 0;
  }
}
