package com.ssafy.backend.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.backend.Enum.UploadType;
import com.ssafy.backend.entity.S3File;
import com.ssafy.backend.repository.S3Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {
    private final AmazonS3Client amazonS3Client;
    private final S3Repository s3Repository;
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String upload(UploadType uploadType, MultipartFile multipartFile) throws IOException {
        String uploadFileName = getUUIDFileName(Objects.requireNonNull(multipartFile.getOriginalFilename()));

        ObjectMetadata objMeta = new ObjectMetadata();
        objMeta.setContentLength(multipartFile.getSize());
        objMeta.setContentType(multipartFile.getContentType());

        String uploadPath = uploadType.name() + "/" + uploadFileName;

        amazonS3Client.putObject(new PutObjectRequest(bucket, uploadPath, multipartFile.getInputStream(), objMeta));

        String uploadFileUrl = amazonS3Client.getUrl(bucket, uploadPath).toString();

        s3Repository.save(S3File.builder()
                .originalFileName(multipartFile.getOriginalFilename())
                .uploadFileName(uploadFileName)
                .uploadFilePath(uploadType.name())
                .uploadFileUrl(uploadFileUrl)
                .build());

        return uploadFileUrl;
    }

    @Transactional
    public void deleteImg(String imgSrc) {
        String[] urlParse = imgSrc.split("/");
        String deleteFile = urlParse[3] + "/" + urlParse[4];
        if (amazonS3Client.doesObjectExist(bucket, deleteFile)) {
            amazonS3Client.deleteObject(bucket, deleteFile);
            s3Repository.deleteByUploadFileUrl(imgSrc);
        }
    }

    public String getUUIDFileName(String fileName) {
        String ext = fileName.substring(fileName.indexOf(".") + 1);
        return UUID.randomUUID() + "." + ext;
    }
}
