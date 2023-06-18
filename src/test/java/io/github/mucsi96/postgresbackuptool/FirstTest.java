package io.github.mucsi96.postgresbackuptool;

import java.time.Duration;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class FirstTest extends BaseIntegrationTest {

  @Test
  public void first_test() {
    // https://github.com/findify/s3mock
    webDriver.get("http://localhost:8080");
    WebDriverWait wait = new WebDriverWait(webDriver, Duration.ofSeconds(5));
    wait.until(ExpectedConditions
        .visibilityOfElementLocated(By.tagName("app-header")));
    takeScreenshot("first_test");
  }
}
