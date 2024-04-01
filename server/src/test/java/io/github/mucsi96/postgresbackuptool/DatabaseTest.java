package io.github.mucsi96.postgresbackuptool;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.util.List;
import java.util.Map;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

public class DatabaseTest extends BaseIntegrationTest {

  @Test
  public void shows_total_record_count_in_db() {
    setupMocks();

    assertThat(page.getByRole(AriaRole.HEADING,
        new Page.GetByRoleOptions().setName("Records"))).hasText("Records 9");
  }

  @Test
  public void shows_total_table_count_in_db() {
    setupMocks();

    assertThat(page.getByRole(AriaRole.HEADING,
        new Page.GetByRoleOptions().setName("Tables"))).hasText("Tables 2");
  }

  @Test
  public void shows_tables_and_record_count_in_db() {
    setupMocks();
    Locator tables = page.locator("table:near(:text('Tables'))");

    assertThat(tables.locator("thead th"))
        .containsText(new String[] { "Name", "Records" });

    assertThat(tables.locator("tbody tr")).hasCount(2);

    assertThat(tables.locator("tbody tr").nth(0).locator("td"))
        .containsText(new String[] { "fruites", "4" });

    assertThat(tables.locator("tbody tr").nth(1).locator("td"))
        .containsText(new String[] { "vegetables", "5" });
  }

  @Test
  public void restores_backup() {
    setupMocks();

    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Backup")).click();

    assertThat(page.getByRole(AriaRole.STATUS)
        .filter(new Locator.FilterOptions().setHasText("Backup created")))
            .isVisible();

    cleanupDB();
    page.reload();

    assertThat(page.getByRole(AriaRole.HEADING,
        new Page.GetByRoleOptions().setName("Tables"))).hasText("Tables 0");

    assertThat(page.getByRole(AriaRole.HEADING,
        new Page.GetByRoleOptions().setName("Records"))).hasText("Records 0");

    Locator backupsTable = page.locator("table:near(:text('Backups'))");
    backupsTable.locator("td:has-text('1 day')").click();
    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Restore")).click();

    assertThat(page.getByRole(AriaRole.STATUS)
        .filter(new Locator.FilterOptions().setHasText("Backup restored")))
            .isVisible();

    assertThat(page.getByRole(AriaRole.HEADING,
        new Page.GetByRoleOptions().setName("Tables"))).hasText("Tables 2");

    assertThat(page.getByRole(AriaRole.HEADING,
        new Page.GetByRoleOptions().setName("Records"))).hasText("Records 9");
  }

  @Test
  public void doesnt_restore_excluded_tables() {
    setupMocks();

    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Backup")).click();

    assertThat(page.getByRole(AriaRole.STATUS)
        .filter(new Locator.FilterOptions().setHasText("Backup created")))
            .isVisible();

    Locator backupsTable = page.locator("table:near(:text('Backups'))");
    backupsTable.locator("td:has-text('1 day')").click();
    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Restore")).click();

    assertThat(page.getByRole(AriaRole.STATUS)
        .filter(new Locator.FilterOptions().setHasText("Backup restored")))
            .isVisible();

    List<Map<String, Object>> result = jdbcTemplate.queryForList(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");

    List<String> tables = result.stream()
        .map(table -> (String) table.get("table_name")).toList();

    Assertions.assertThat(tables).doesNotContain("passwords", "secrets");
  }
}
