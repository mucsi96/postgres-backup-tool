package io.github.mucsi96.postgresbackuptool.controller;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import io.github.mucsi96.postgresbackuptool.model.Database;
import io.github.mucsi96.postgresbackuptool.service.DatabaseService;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping(value = "/tables", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class DatabaseController {
  private final DatabaseService databaseService;

  @GetMapping
  @ResponseBody
  public Database getDatabaseInfo() {
    return databaseService.getDatabaseInfo();
  }
}
