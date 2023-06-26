package io.github.mucsi96.postgresbackuptool;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class FirstTest extends BaseIntegrationTest {

  @Test
  public void shows_total_record_count_in_db() {
    WebElement element = webDriver
        .findElement(By.xpath("//app-heading[contains(text(), \"Records\")]"));
    assertThat(element.getText()).isEqualTo("Records 9");
  }

  @Test
  public void shows_total_table_count_in_db() {
    WebElement element = webDriver
        .findElement(By.xpath("//app-heading[contains(text(), \"Tables\")]"));
    assertThat(element.getText()).isEqualTo("Tables 2");
  }

  @Test
  public void shows_tables_and_record_count_in_db() {
    WebElement table = webDriver.findElement(By.xpath(
        "//app-heading[contains(text(), \"Tables\")]/following-sibling::app-table"));

    assertThat(table.getText().split("\\s+")).isEqualTo(
        new String[] { "Name", "Records", "fruites", "4", "vegetables", "5" });

  }

  @Test
  public void shows_number_of_backups() {
    WebElement element = webDriver
        .findElement(By.xpath("//app-heading[contains(text(), \"Backups\")]"));
    assertThat(element.getText()).isEqualTo("Backups 0");

    webDriver
        .findElement(By.xpath("//app-button[contains(text(), \"Backup\")]"))
        .click();

    wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//app-notification[contains(text(), \"Backup created\")]")));

    assertThat(element.getText()).isEqualTo("Backups 1");
  }

  @Test
  public void shows_last_backup_time() {
    WebElement element = webDriver.findElement(
        By.xpath("//app-heading[contains(text(), \"Last backup\")]"));

    assertThat(element.getText().split("\\s+"))
        .isEqualTo(new String[] { "Last", "backup" });

    webDriver
        .findElement(By.xpath("//app-button[contains(text(), \"Backup\")]"))
        .click();

    wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//app-notification[contains(text(), \"Backup created\")]")));

    assertThat(element.getText().split("\\s+"))
        .isEqualTo(new String[] { "Last", "backup", "0", "seconds", "ago" });
  }

}
