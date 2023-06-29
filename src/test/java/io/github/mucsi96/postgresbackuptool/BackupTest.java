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
                WebElement backupsHeadingBefore = webDriver.findElement(By
                                .xpath("//app-heading[contains(text(), \"Backups\")]"));
                assertThat(backupsHeadingBefore.getText())
                                .isEqualTo("Backups 0");

                createMockBackup(Instant.ofEpochSecond(1688042561), 1, 1);
                createMockBackup(Instant.ofEpochSecond(1688042562), 1, 1);
                createMockBackup(Instant.ofEpochSecond(1688042563), 1, 1);

                reload();

                WebElement backupsHeadingAfter = webDriver.findElement(By.xpath(
                                "//app-heading[contains(text(), \"Backups\")]"));

                assertThat(backupsHeadingAfter.getText())
                                .isEqualTo("Backups 3");
        }

        @Test
        public void shows_last_backup_time() {
                WebElement lastBackupBefore = webDriver.findElement(By.xpath(
                                "//app-heading[contains(text(), \"Last backup\")]"));

                assertThat(lastBackupBefore.getText().split("\\s+"))
                                .isEqualTo(new String[] { "Last", "backup" });

                createMockBackup(Instant.now().minus(Period.ofDays(60)), 1, 1);
                createMockBackup(Instant.now().minus(Period.ofDays(30)), 1, 1);
                createMockBackup(Instant.now().minus(Period.ofDays(7)), 1, 1);

                reload();

                WebElement lastBackupAfter = webDriver.findElement(By.xpath(
                                "//app-heading[contains(text(), \"Last backup\")]"));

                assertThat(lastBackupAfter.getText().split("\\s+"))
                                .isEqualTo(new String[] { "Last", "backup", "1",
                                                "week", "ago" });
        }

        @Test
        public void shows_backups() {
                createMockBackup(Instant.ofEpochSecond(1688042561), 1, 30);
                createMockBackup(Instant.ofEpochSecond(1688042562), 3, 7);
                createMockBackup(Instant.ofEpochSecond(1688042563), 9, 1);

                reload();

                WebElement table = webDriver.findElement(By.xpath(
                                "//app-heading[contains(text(), \"Backups\")]/following-sibling::app-table"));

                assertThat(table.getText().split("\\s+"))
                                .isEqualTo(new String[] { "Date", "Name",
                                                "Records", "Size", "Retention",
                                                "Action", "1", "minute", "ago",
                                                "20230629-124243.9.1.pgdump",
                                                "9", "0.0", "B", "1", "day",
                                                "Restore", "1", "minute", "ago",
                                                "20230629-124242.3.7.pgdump",
                                                "3", "0.0", "B", "7", "days",
                                                "Restore", "1", "minute", "ago",
                                                "20230629-124241.1.30.pgdump",
                                                "1", "0.0", "B", "30", "days",
                                                "Restore" });
        }
}
