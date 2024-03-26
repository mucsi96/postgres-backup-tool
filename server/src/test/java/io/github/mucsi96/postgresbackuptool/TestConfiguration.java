package io.github.mucsi96.postgresbackuptool;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.BrowserType.LaunchOptions;

@Configuration
public class TestConfiguration {
  @Bean
  public Page getPage() {
    Playwright playwright = Playwright.create();

    Browser browser = playwright.chromium()
        .launch(new LaunchOptions().setArgs(
            List.of("--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage",
                "--window-size=1920,1080", "--remote-allow-origins=*")));

    return browser.newPage();
  }
}
