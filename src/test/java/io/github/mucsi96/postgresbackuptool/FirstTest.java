package io.github.mucsi96.postgresbackuptool;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.logging.Level;
import java.io.File;
import java.io.IOException;
import java.time.Duration;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Profile;

@Profile("test")
public class FirstTest {
  static WebDriver webDriver;

  @LocalServerPort
  private int port;

  @BeforeAll
  public static void setup() {
    ChromeOptions options = new ChromeOptions()
        .addArguments("--disable-gpu", "--no-sandbox",
            "--disable-dev-shm-usage", "--window-size=1920,1080", "--remote-allow-origins=*")
        .setHeadless(true);

    ChromeDriver driver = new ChromeDriver(options);
    driver.setLogLevel(Level.WARNING);
    webDriver = driver;
  }

  @AfterAll
  public static void tearDown() {
    webDriver.close();
  }

  public static void takeScreenshot(String name) {
    File tmpFile = ((TakesScreenshot)webDriver).getScreenshotAs(OutputType.FILE);
    File destFile = new File("screenshots/" + name + ".png");
    try {
      FileUtils.moveFile(tmpFile, destFile);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  @Test
  public void first_test() {
    //https://github.com/findify/s3mock

    webDriver.get("http://localhost:8080");
    WebDriverWait wait = new WebDriverWait(webDriver, Duration.ofSeconds(5));
    wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("app-header")));
    takeScreenshot("first_test");
  }
}
