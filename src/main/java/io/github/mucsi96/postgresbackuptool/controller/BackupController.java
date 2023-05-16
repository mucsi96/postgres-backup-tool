package io.github.mucsi96.postgresbackuptool.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import io.github.mucsi96.postgresbackuptool.model.Backup;
import io.github.mucsi96.postgresbackuptool.service.BackupService;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping(value = "/backups", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class BackupController {
  private final BackupService backupService;

  @GetMapping
  @ResponseBody
  List<Backup> list() {
    return backupService.getBackups();
  }
}
