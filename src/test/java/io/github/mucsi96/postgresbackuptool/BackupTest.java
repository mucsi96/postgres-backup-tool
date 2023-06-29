package io.github.mucsi96.postgresbackuptool;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.time.Period;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class BackupTest extends BaseIntegrationTest {

    @Test
    public void shows_number_of_backups() {
        WebElement backupsHeadingBefore = webDriver.findElement(
                By.xpath("//app-heading[contains(text(), \"Backups\")]"));
        assertThat(backupsHeadingBefore.getText()).isEqualTo("Backups 0");

        createMockBackup(Instant.now().minus(Period.ofDays(1)), 1, 1);
        createMockBackup(Instant.now().minus(Period.ofDays(1)), 2, 1);
        createMockBackup(Instant.now().minus(Period.ofDays(1)), 3, 1);

        reload();

        WebElement backupsHeadingAfter = webDriver.findElement(
                By.xpath("//app-heading[contains(text(), \"Backups\")]"));

        assertThat(backupsHeadingAfter.getText()).isEqualTo("Backups 3");
    }

    @Test
    public void shows_last_backup_time() {
        WebElement lastBackupBefore = webDriver.findElement(
                By.xpath("//app-heading[contains(text(), \"Last backup\")]"));

        assertThat(lastBackupBefore.getText().split("\\s+"))
                .isEqualTo(new String[] { "Last", "backup" });

        createMockBackup(Instant.now().minus(Period.ofDays(60)), 1, 1);
        createMockBackup(Instant.now().minus(Period.ofDays(30)), 1, 1);
        createMockBackup(Instant.now().minus(Period.ofDays(7)), 1, 1);

        reload();

        WebElement lastBackupAfter = webDriver.findElement(
                By.xpath("//app-heading[contains(text(), \"Last backup\")]"));

        assertThat(lastBackupAfter.getText().split("\\s+")).isEqualTo(
                new String[] { "Last", "backup", "1", "week", "ago" });
    }

    @Test
    public void shows_backups() {
        createMockBackup(Instant.now().minus(Period.ofDays(60)), 1, 30);
        createMockBackup(Instant.now().minus(Period.ofDays(30)), 3, 7);
        createMockBackup(Instant.now().minus(Period.ofDays(7)), 9, 1);

        reload();

        WebElement table = webDriver.findElement(By.xpath(
                "//app-heading[contains(text(), \"Backups\")]/following-sibling::app-table"));

        assertThat(table.getText().split("\\s+")).isEqualTo(new String[] {
                "Date", "Name", "Records", "Size", "Retention", "Action",
                "last", "week", "20230622-070113.9.1.pgdump", "9", "0.0", "B",
                "1", "day", "Restore", "last", "month",
                "20230530-070113.3.7.pgdump", "3", "0.0", "B", "7", "days",
                "Restore", "2", "months", "ago", "20230430-070113.1.30.pgdump",
                "1", "0.0", "B", "30", "days", "Restore" });
    }
}
