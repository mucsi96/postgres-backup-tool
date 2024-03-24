package io.github.mucsi96.postgresbackuptool;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import io.github.mucsi96.postgresbackuptool.model.Table;
import io.github.mucsi96.postgresbackuptool.model.TableRow;
import io.github.mucsi96.postgresbackuptool.utils.TableUtils;

public class DatabaseTest extends BaseIntegrationTest {

  @Test
  public void shows_total_record_count_in_db() {
    setupMocks();
    WebElement element = webDriver
        .findElement(By.xpath("//app-heading[contains(text(), \"Records\")]"));
    assertThat(element.getText()).isEqualTo("Records 9");
  }

  @Test
  public void shows_total_table_count_in_db() {
    setupMocks();
    WebElement element = webDriver
        .findElement(By.xpath("//app-heading[contains(text(), \"Tables\")]"));
    assertThat(element.getText()).isEqualTo("Tables 2");
  }

  @Test
  public void shows_tables_and_record_count_in_db() {
    setupMocks();
    WebElement table = webDriver.findElement(By.xpath(
        "//app-heading[contains(text(), \"Tables\")]/following-sibling::app-table"));

    List<TableRow> tables = getDatabaseTables();

    assertThat(TableUtils.getHeaders(table))
        .isEqualTo(List.of("NAME", "RECORDS"));

    assertThat(tables.size()).isEqualTo(2);

    assertThat(tables.get(0).getName()).isEqualTo("fruites");
    assertThat(tables.get(0).getRows()).isEqualTo(4);
    assertThat(tables.get(1).getName()).isEqualTo("vegetables");
    assertThat(tables.get(1).getRows()).isEqualTo(5);
  }

  @Test
  public void restores_backup() {
    setupMocks();
    wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//app-button[contains(text(), \"Backup\")]")));
    webDriver
        .findElement(By.xpath("//app-button[contains(text(), \"Backup\")]"))
        .click();

    wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//app-notification[contains(text(), \"Backup created\")]")));

    cleanupDB();
    webDriver.navigate().refresh();

    wait.until(ExpectedConditions
        .refreshed(ExpectedConditions.visibilityOfElementLocated(
            By.xpath("//app-heading[contains(text(), \"Tables\")]"))));

    assertThat(webDriver
        .findElement(By.xpath("//app-heading[contains(text(), \"Tables\")]"))
        .getText()).isEqualTo("Tables 0");

    assertThat(webDriver
        .findElement(By.xpath("//app-heading[contains(text(), \"Records\")]"))
        .getText()).isEqualTo("Records 0");

    WebElement backupsTable = webDriver.findElement(By.xpath(
        "//app-heading[contains(text(), \"Backups\")]/following-sibling::app-table"));

    backupsTable.findElement(By.xpath("//td[contains(text(), \"1 day\")]"))
        .click();
    webDriver
        .findElement(By.xpath("//app-button[contains(text(), \"Restore\")]"))
        .click();

    wait.until(ExpectedConditions
        .refreshed(ExpectedConditions.visibilityOfElementLocated(
            By.xpath("//app-heading[contains(text(), \"Tables\")]"))));

    wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//app-notification[contains(text(), \"Backup restored\")]")));

    assertThat(webDriver
        .findElement(By.xpath("//app-heading[contains(text(), \"Tables\")]"))
        .getText()).isEqualTo("Tables 2");

    assertThat(webDriver
        .findElement(By.xpath("//app-heading[contains(text(), \"Records\")]"))
        .getText()).isEqualTo("Records 9");
  }

  @Test
  public void doesnt_restore_excluded_tables() {
    setupMocks();
    webDriver
        .findElement(By.xpath("//app-button[contains(text(), \"Backup\")]"))
        .click();

    wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//app-notification[contains(text(), \"Backup created\")]")));

    WebElement backupsTable = webDriver.findElement(By.xpath(
        "//app-heading[contains(text(), \"Backups\")]/following-sibling::app-table"));

    backupsTable.findElement(By.xpath("//td[contains(text(), \"1 day\")]"))
        .click();
    webDriver
        .findElement(By.xpath("//app-button[contains(text(), \"Restore\")]"))
        .click();

    wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//app-notification[contains(text(), \"Backup restored\")]")));

    List<Map<String, Object>> result = jdbcTemplate.queryForList(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");

    List<String> tables = result.stream()
        .map(table -> (String) table.get("table_name")).toList();

    assertThat(tables).doesNotContain("passwords", "secrets");
  }
}
