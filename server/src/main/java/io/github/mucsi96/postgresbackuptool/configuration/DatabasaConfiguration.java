package io.github.mucsi96.postgresbackuptool.configuration;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.lang.NonNull;


@Configuration
public class DatabasaConfiguration {
  @Bean
  public JdbcTemplate jdbcTemplate(@NonNull DataSource dataSource) {
    return new JdbcTemplate(dataSource);
  }
}
