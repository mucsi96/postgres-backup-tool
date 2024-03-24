package io.github.mucsi96.postgresbackuptool.utils;

import java.util.List;
import java.util.function.Function;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class TableUtils {

  public static List<String> getHeaders(WebElement table) {
    return table.findElements(By.cssSelector("thead > tr > th")).stream()
        .map(WebElement::getText).toList();
  }

  public static <T> List<T> getRows(WebElement table,
      Function<List<WebElement>, T> rowMapper) {
    return table.findElements(By.cssSelector("tbody > tr")).stream()
        .map(tr -> rowMapper.apply(tr.findElements(By.tagName("td")))).toList();
  }

}
