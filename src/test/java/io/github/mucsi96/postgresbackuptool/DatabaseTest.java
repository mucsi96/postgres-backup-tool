package io.github.mucsi96.postgresbackuptool;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class DatabaseTest extends BaseIntegrationTest {

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
}
