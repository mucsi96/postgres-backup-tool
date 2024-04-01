package io.github.mucsi96.postgresbackuptool;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.Instant;
import java.time.Period;

import org.junit.jupiter.api.Test;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

public class BackupTest extends BaseIntegrationTest {

  @Test
  public void shows_number_of_backups() {
    setupMocks(() -> {
      createMockBackup(Instant.ofEpochSecond(1688042561), 1, 1);
      createMockBackup(Instant.ofEpochSecond(1688042562), 1, 1);
      createMockBackup(Instant.ofEpochSecond(1688042563), 1, 1);
    });

    assertThat(page.getByRole(AriaRole.HEADING,
        new Page.GetByRoleOptions().setName("Backups"))).hasText("Backups 3");
  }

  @Test
  public void shows_last_backup_time() {
    setupMocks(() -> {
      createMockBackup(Instant.now().minus(Period.ofDays(60)), 1, 1);
      createMockBackup(Instant.now().minus(Period.ofDays(30)), 1, 1);
      createMockBackup(Instant.now().minus(Period.ofDays(7)), 1, 1);
    });

    assertThat(page.getByRole(AriaRole.HEADING,
        new Page.GetByRoleOptions().setName("Last backup")))
            .hasText("Last backup last week");
  }

  @Test
  public void shows_backups() {
    setupMocks(() -> {
      createMockBackup(Instant.ofEpochSecond(1685596163), 1, 30);
      createMockBackup(Instant.now().minus(Period.ofDays(14)), 3, 7);
      createMockBackup(Instant.ofEpochSecond(1685682577), 9, 1);
    });

    Locator backups = page.locator("table:near(:text('Backups'))");

    assertThat(backups.locator("thead th")).containsText(
        new String[] { "Date", "Name", "Records", "Size", "Retention" });

    assertThat(backups.locator("tbody tr")).hasCount(3);

    assertThat(
        backups.locator("tbody tr").nth(0).locator("td:not(:nth-child(3))"))
            .containsText(
                new String[] { "", "2 weeks ago", "3", "0.0 B", "7 days" });

    assertThat(
        backups.locator("tbody tr").nth(1).locator("td:not(:nth-child(2))"))
            .containsText(new String[] { "", "20230602-050937.9.1.pgdump", "9",
                "0.0 B", "1 day" });

    assertThat(
        backups.locator("tbody tr").nth(2).locator("td:not(:nth-child(2))"))
            .containsText(new String[] { "", "20230601-050923.1.30.pgdump", "1",
                "0.0 B", "30 days" });
  }

  @Test
  public void creates_backup() {
    setupMocks();
    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Backup")).click();

    assertThat(page.getByRole(AriaRole.STATUS)
        .filter(new Locator.FilterOptions().setHasText("Backup created")))
            .isVisible();

    Locator backups = page.locator("table:near(:text('Backups'))");

    assertThat(backups.locator("tbody tr")).hasCount(1);

    assertThat(backups.locator("tbody tr").nth(0).locator("td"))
        .containsText(new String[] { "9", "1.7 KB", "1 day" });
  }

  @Test
  public void creates_backup_with_retention() {
    setupMocks();
    Locator retentionPeriodInput = page.getByLabel("Retention period");

    retentionPeriodInput.clear();
    retentionPeriodInput.fill("7");

    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Backup")).click();
    assertThat(page.getByRole(AriaRole.STATUS)
        .filter(new Locator.FilterOptions().setHasText("Backup created")))
            .isVisible();

    Locator backups = page.locator("table:near(:text('Backups'))");

    assertThat(backups.locator("tbody tr")).hasCount(1);

    assertThat(backups.locator("tbody tr").nth(0).locator("td"))
        .containsText(new String[] { "9", "1.7 KB", "7 days" });
  }

  @Test
  public void cleans_up_outdated_backups() {
    setupMocks(() -> {
      createMockBackup(Instant.now().minus(Period.ofDays(30)), 1, 31);
      createMockBackup(Instant.now().minus(Period.ofDays(7)), 2, 7);
      createMockBackup(Instant.now().minus(Period.ofDays(1)), 3, 1);
      createMockBackup(Instant.now().minus(Period.ofDays(1)), 4, 2);
    });

    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Cleanup")).click();

    assertThat(page.getByRole(AriaRole.STATUS)
        .filter(new Locator.FilterOptions().setHasText("Cleanup finished")))
            .isVisible();

    Locator backups = page.locator("table:near(:text('Backups'))");

    assertThat(backups.locator("tbody tr")).hasCount(2);

    assertThat(
        backups.locator("tbody tr").nth(0).locator("td:not(:nth-child(3))"))
            .containsText(new String[] { "yesterday", "4", "0.0 B", "2 days" });
    assertThat(
        backups.locator("tbody tr").nth(1).locator("td:not(:nth-child(3))"))
            .containsText(
                new String[] { "last month", "1", "0.0 B", "31 days" });
  }
}
