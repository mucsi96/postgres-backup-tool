package io.github.mucsi96.postgresbackuptool;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;

public class ScreenshotOnFailure implements TestWatcher {

  WebDriver webDriver;

  static {
    try {
      FileUtils.deleteDirectory(new File("screenshots"));
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  @Override
  public void testFailed(ExtensionContext context, Throwable cause) {
    String name = context.getTestClass().get().getSimpleName() + "-"
        + context.getDisplayName().replaceAll("[^a-zA-Z0-9_]", "");
    ApplicationContext springContext = SpringExtension
        .getApplicationContext(context);
    takeScreenshot(springContext.getBean(WebDriver.class), name);
  }

  public void takeScreenshot(WebDriver webDriver, String name) {
    File tmpFile = ((TakesScreenshot) webDriver)
        .getScreenshotAs(OutputType.FILE);
    File destFile = new File("screenshots/" + name + ".png");
    try {
      if (destFile.exists()) {
        destFile.delete();
      }
      FileUtils.moveFile(tmpFile, destFile);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

}
