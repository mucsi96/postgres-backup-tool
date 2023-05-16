package io.github.mucsi96.postgresbackuptool.configuration;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.endpoints.Endpoint;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.endpoints.S3EndpointParams;
import software.amazon.awssdk.services.s3.endpoints.S3EndpointProvider;

@Configuration
public class BackupConfiguration {

    @Bean
    public S3Client s3Client(@Value("${r2.endpoint}") String r2ServiceEndpoint,
            @Value("${r2.accessKey}") String accessKeyValue,
            @Value("${r2.secretKey}") String secretKeyValue)
            throws URISyntaxException {
        return S3Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(
                        StaticCredentialsProvider.create(AwsBasicCredentials
                                .create(accessKeyValue, secretKeyValue)))
                .endpointOverride(new URI(r2ServiceEndpoint)).build();

        // return S3Client.builder().region(Region.US_EAST_1)
        // .endpointProvider(
        // new BackupEndpointProvider(new URI(r2ServiceEndpoint)))
        // .credentialsProvider(new BackupCredentialsProvider(
        // accessKeyValue, secretKeyValue))
        // .forcePathStyle(true).build();

    }
}

@RequiredArgsConstructor
class BackupEndpointProvider implements S3EndpointProvider {

    private final URI endpointUrl;

    @Override
    public CompletableFuture<Endpoint> resolveEndpoint(
            S3EndpointParams endpointParams) {
        return CompletableFuture
                .completedFuture(Endpoint.builder().url(endpointUrl).build());
    }

}

@RequiredArgsConstructor
class BackupCredentialsProvider implements AwsCredentialsProvider {

    private final String accessKeyId;
    private final String secretAccessKey;

    @Override
    public AwsCredentials resolveCredentials() {
        return AwsBasicCredentials.create(accessKeyId, secretAccessKey);
    }

}
