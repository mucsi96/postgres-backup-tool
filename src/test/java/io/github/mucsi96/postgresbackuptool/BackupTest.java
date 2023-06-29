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

        createMockBackup(Instant.now().minus(Period.ofWeeks(1)), 9, 1);

        reload();

        WebElement backupsHeadingAfter = webDriver.findElement(
                By.xpath("//app-heading[contains(text(), \"Backups\")]"));

        assertThat(backupsHeadingAfter.getText()).isEqualTo("Backups 1");
    }

    @Test
    public void shows_last_backup_time() {
        WebElement lastBackupBefore = webDriver.findElement(
                By.xpath("//app-heading[contains(text(), \"Last backup\")]"));

        assertThat(lastBackupBefore.getText().split("\\s+"))
                .isEqualTo(new String[] { "Last", "backup" });

        createMockBackup(Instant.now().minus(Period.ofDays(7)), 9, 1);

        reload();

        WebElement lastBackupAfter = webDriver.findElement(
                By.xpath("//app-heading[contains(text(), \"Last backup\")]"));

        assertThat(lastBackupAfter.getText().split("\\s+")).isEqualTo(
                new String[] { "Last", "backup", "1", "week", "ago" });
    }

}
