package io.github.mucsi96.postgresbackuptool.service;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.stereotype.Service;

import io.github.mucsi96.postgresbackuptool.model.Database;
import io.github.mucsi96.postgresbackuptool.model.Table;

@Service
public class DatabaseService {
  private final JdbcTemplate jdbcTemplate;
  private final String databaseName;
  private final String restoreDatabaseName;
  private final String connectionString;
  private final List<String> excludeTables;
  private final String restoreConnectionString;
  private final String rootDatasourceUrl;
  private final String datasourceUsername;
  private final String datasourcePassword;
  private final DateTimeFormatter dateTimeFormatter;

  public DatabaseService(JdbcTemplate jdbcTemplate,
      @Value("${postgres.database-name}") String databaseName,
      @Value("${postgres.connection-string}") String connectionString,
      @Value("${postgres.exclude-tables}") String excludeTables,
      @Value("${postgres.root-url}") String restoreDatasourceUrl,
      @Value("${spring.datasource.username}") String datasourceUsername,
      @Value("${spring.datasource.password}") String datasourcePassword,
      DateTimeFormatter dateTimeFormatter) {
    this.jdbcTemplate = jdbcTemplate;
    this.databaseName = databaseName;
    this.restoreDatabaseName = databaseName + "_restore";
    this.connectionString = connectionString;
    this.excludeTables = Arrays.asList(excludeTables.split(",")).stream()
        .map(name -> name.trim()).filter(name -> name.length() > 0).toList();
    this.restoreConnectionString = connectionString + "_restore";
    this.rootDatasourceUrl = restoreDatasourceUrl;
    this.datasourceUsername = datasourceUsername;
    this.datasourcePassword = datasourcePassword;
    this.dateTimeFormatter = dateTimeFormatter;
  }

  public Database getDatabaseInfo() {
    List<Map<String, Object>> result = jdbcTemplate.queryForList(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");

    List<Table> tables = result.stream()
        .filter(table -> !excludeTables.contains(table.get("table_name")))
        .map(table -> {
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
    String timeString = dateTimeFormatter.format(Instant.now());
    String filename = String.format("%s.%s.%s.pgdump", timeString,
        getDatabaseInfo().getTotalRowCount(), retentionPeriod);
    List<String> commands = Stream.of(
        List.of("pg_dump", "--dbname", connectionString, "--format", "c",
            "--file", filename),
        excludeTables.stream()
            .flatMap(table -> List.of("--exclude-table", table).stream())
            .toList())
        .flatMap(x -> x.stream()).toList();

    System.out.println("Creating dump: " + String.join(", ", commands));

    new ProcessBuilder(commands).inheritIO().start().waitFor();

    File file = new File(filename);

    if (!file.exists()) {
      throw new RuntimeException(
          "Unable to create dump. " + file + " was not created.");
    }

    System.out.println("Dump created");

    return file;
  }

  public void restoreDump(File dumpFile)
      throws IOException, InterruptedException {
    DataSource dataSource = new DriverManagerDataSource(rootDatasourceUrl,
      datasourceUsername, datasourcePassword);
    JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

    System.out.println("Preparig restore db");

    jdbcTemplate.execute(
      String.format("DROP DATABASE IF EXISTS \"%s\";", restoreDatabaseName));
    jdbcTemplate
      .execute(String.format("CREATE DATABASE \"%s\";", restoreDatabaseName));

    System.out.println("Restore db prepared");

    new ProcessBuilder("pg_restore", "--dbname", restoreConnectionString,
      "--verbose", dumpFile.getName()).inheritIO().start().waitFor();

    System.out.println("Restore complete");

    jdbcTemplate.execute(String.format(
        "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '%s' AND pid <> pg_backend_pid();",
        databaseName));
    jdbcTemplate.execute(
        String.format("DROP DATABASE IF EXISTS \"%s\";", databaseName));
    jdbcTemplate
        .execute(String.format("ALTER DATABASE \"%s\" RENAME TO \"%s\";",
            restoreDatabaseName, databaseName));

    System.out.println("Switch complete");
  }

  private int getTableRowCount(String tableName) {
    Integer count = jdbcTemplate
        .queryForObject("SELECT COUNT(*) FROM " + tableName, Integer.class);

    return count != null ? count : 0;
  }
}
