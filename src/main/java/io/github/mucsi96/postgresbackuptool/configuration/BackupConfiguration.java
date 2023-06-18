package io.github.mucsi96.postgresbackuptool.configuration;

import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

@Configuration
public class BackupConfiguration {

        @Bean
        public S3Client s3Client(@Value("${s3.endpoint}") String endpointUrl,
                        @Value("${s3.access-key}") String accessKeyValue,
                        @Value("${s3.secret-key}") String secretKeyValue)
                        throws URISyntaxException {
                return S3Client.builder().region(Region.US_EAST_1)
                                .credentialsProvider(StaticCredentialsProvider
                                                .create(AwsBasicCredentials
                                                                .create(accessKeyValue,
                                                                                secretKeyValue)))
                                .serviceConfiguration(S3Configuration.builder()
                                                .pathStyleAccessEnabled(true)
                                                .build())
                                .endpointOverride(URI.create(endpointUrl)).build();
        }
}
