package io.github.mucsi96.postgresbackuptool;

import java.util.logging.Level;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebDriverConfiguration {
  @Bean
  public WebDriver getWebDriver() {
    ChromeOptions options = new ChromeOptions().addArguments("--headless",
        "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage",
        "--window-size=1920,1080", "--remote-allow-origins=*");

    ChromeDriver driver = new ChromeDriver(options);
    driver.setLogLevel(Level.WARNING);
    return driver;
  }
}
