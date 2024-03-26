package io.github.mucsi96.postgresbackuptool;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.microsoft.playwright.Page;

public class ScreenshotOnFailure implements AfterEachCallback {

  static {
    try {
      FileUtils.deleteDirectory(new File("screenshots"));
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  @Override
  public void afterEach(ExtensionContext context) throws Exception {
    if (context.getExecutionException().isPresent()) {
      String name = context.getTestClass().get().getSimpleName() + "-"
          + context.getDisplayName().replaceAll("[^a-zA-Z0-9_]", "");
      ApplicationContext springContext = SpringExtension
          .getApplicationContext(context);
      takeScreenshot(springContext.getBean(Page.class), name);
    }
  }

  public void takeScreenshot(Page page, String name) {
    page.screenshot(new Page.ScreenshotOptions()
        .setPath(Paths.get("screenshots/" + name + ".png")));
  }
}
