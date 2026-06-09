package com.coffee.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import jakarta.annotation.PostConstruct;

@Service
public class S3Service {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region}")
    private String region;

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    // S3와 통신하는 클라이언트 객체 (창고 출입용 도구)
    private S3Client s3Client;

    // 이 클래스가 만들어지고 @Value 주입이 끝난 직후 딱 한 번 실행됨
    // → 액세스 키로 S3 클라이언트를 미리 만들어둠
    @PostConstruct
    public void init() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();
    }

    // 이미지 바이트 데이터를 S3에 업로드하고, 접근 가능한 전체 URL을 리턴
    public String upload(byte[] imageBytes, String fileName) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(fileName)              // S3 안에서의 파일 이름(키)
                .contentType("image/jpeg")  // 브라우저가 이미지로 인식하게
                .build();

        // 실제 업로드 실행
        s3Client.putObject(request, RequestBody.fromBytes(imageBytes));

        // 업로드된 객체의 공개 URL을 조립해서 리턴
        // 예: https://coffee-shop-images-hyeonmin.s3.ap-northeast-2.amazonaws.com/product_xxx.jpg
        return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + fileName;
    }

    // S3에서 객체(이미지) 삭제
    // fileName은 S3 키(파일명). 전체 URL이 넘어오면 파일명만 뽑아서 사용
    public void delete(String fileNameOrUrl) {
        String key = extractKey(fileNameOrUrl);

        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        s3Client.deleteObject(request);
    }

    // 전체 URL이든 파일명이든, S3 키(파일명)만 뽑아내는 헬퍼
    private String extractKey(String fileNameOrUrl) {
        if (fileNameOrUrl == null) return null;
        // URL이면 마지막 / 뒤가 파일명
        int lastSlash = fileNameOrUrl.lastIndexOf('/');
        return lastSlash >= 0 ? fileNameOrUrl.substring(lastSlash + 1) : fileNameOrUrl;
    }
}