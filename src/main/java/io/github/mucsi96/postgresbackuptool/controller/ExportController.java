package io.github.mucsi96.postgresbackuptool.controller;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.github.mucsi96.postgresbackuptool.service.DatabaseService;
import lombok.RequiredArgsConstructor;

@RestController
@Validated
@RequestMapping(value = "/export", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class ExportController {
  private final DatabaseService databaseService;

  @GetMapping
  @ResponseBody
  public String getDatabaseInfo() throws IOException, InterruptedException {
    ObjectMapper objectMapper = new ObjectMapper();
    return objectMapper.writeValueAsString(databaseService.createExport());
  }
}
