package io.github.mucsi96.postgresbackuptool;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.time.Period;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import io.github.mucsi96.postgresbackuptool.model.BackupRow;
import io.github.mucsi96.postgresbackuptool.utils.TableUtils;

public class BackupTest extends BaseIntegrationTest {

    @Test
    public void shows_number_of_backups() {
        setupMocks(() -> {
            createMockBackup(Instant.ofEpochSecond(1688042561), 1, 1);
            createMockBackup(Instant.ofEpochSecond(1688042562), 1, 1);
            createMockBackup(Instant.ofEpochSecond(1688042563), 1, 1);
        });

        WebElement backupsHeadingAfter = webDriver.findElement(
                By.xpath("//app-heading[contains(text(), \"Backups\")]"));

        assertThat(backupsHeadingAfter.getText()).isEqualTo("Backups 3");
    }

    @Test
    public void shows_last_backup_time() {
        setupMocks(() -> {
            createMockBackup(Instant.now().minus(Period.ofDays(60)), 1, 1);
            createMockBackup(Instant.now().minus(Period.ofDays(30)), 1, 1);
            createMockBackup(Instant.now().minus(Period.ofDays(7)), 1, 1);
        });

        WebElement lastBackupAfter = webDriver.findElement(
                By.xpath("//app-heading[contains(text(), \"Last backup\")]"));

        assertThat(lastBackupAfter.getText().split("\\s+")).isEqualTo(
                new String[] { "Last", "backup", "1", "week", "ago" });
    }

    @Test
    public void shows_backups() {
        setupMocks(() -> {
            createMockBackup(Instant.ofEpochSecond(1685596163), 1, 30);
            createMockBackup(Instant.now().minus(Period.ofDays(14)), 3, 7);
            createMockBackup(Instant.ofEpochSecond(1685682577), 9, 1);
        });

        WebElement table = webDriver.findElement(By.xpath(
                "//app-heading[contains(text(), \"Backups\")]/following-sibling::app-table"));

        assertThat(TableUtils.getHeaders(table)).isEqualTo(List.of("", "DATE",
                "NAME", "RECORDS", "SIZE", "RETENTION", "ACTION"));

        List<BackupRow> backups = getBackups();

        assertThat(backups.size()).isEqualTo(3);

        assertThat(backups.get(0).getDate()).isEqualTo("2 weeks ago");
        assertThat(backups.get(0).getRecords()).isEqualTo(3);
        assertThat(backups.get(0).getSize()).isEqualTo("0.0 B");
        assertThat(backups.get(0).getRetention()).isEqualTo(7);

        assertThat(backups.get(1).getName())
                .isEqualTo("20230602-050937.9.1.pgdump");
        assertThat(backups.get(1).getRecords()).isEqualTo(9);
        assertThat(backups.get(1).getSize()).isEqualTo("0.0 B");
        assertThat(backups.get(1).getRetention()).isEqualTo(1);

        assertThat(backups.get(2).getName())
                .isEqualTo("20230601-050923.1.30.pgdump");
        assertThat(backups.get(2).getRecords()).isEqualTo(1);
        assertThat(backups.get(2).getSize()).isEqualTo("0.0 B");
        assertThat(backups.get(2).getRetention()).isEqualTo(30);
    }

    @Test
    public void creates_backup() {
        setupMocks();
        webDriver
                .findElement(
                        By.xpath("//app-button[contains(text(), \"Backup\")]"))
                .click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(
                "//app-notification[contains(text(), \"Backup created\")]")));

        List<BackupRow> backups = getBackups();

        assertThat(backups.size()).isEqualTo(1);

        assertThat(backups.get(0).getDate()).isEqualTo("1 second ago");
        assertThat(backups.get(0).getRecords()).isEqualTo(9);
        assertThat(backups.get(0).getRetention()).isEqualTo(1);

    }
}
