package io.github.mucsi96.postgresbackuptool.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import io.github.mucsi96.postgresbackuptool.model.Backup;
import io.github.mucsi96.postgresbackuptool.service.BackupService;
import io.github.mucsi96.postgresbackuptool.service.DatabaseService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class BackupController {
  private final BackupService backupService;
  private final DatabaseService databaseService;

  @GetMapping("/backups")
  @ResponseBody
  List<Backup> list() {
    return backupService.getBackups();
  }

  @PostMapping("/backup")
  @ResponseBody
  void create(
      @RequestParam("retention_period") @Min(1) @Max(356) int retentionPeriod)
      throws IOException, InterruptedException {
    File dumpFile = databaseService.createDump(retentionPeriod);
    backupService.createBackup(dumpFile);

    dumpFile.delete();

    System.out.println(dumpFile);
  }
}
