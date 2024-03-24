package io.github.mucsi96.postgresbackuptool.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.validation.ConstraintViolationException;

@ControllerAdvice
public class AppControllerAdvice {
  
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<Void> handleConstraintViolation() {
    return ResponseEntity.badRequest().build();
  }
}
