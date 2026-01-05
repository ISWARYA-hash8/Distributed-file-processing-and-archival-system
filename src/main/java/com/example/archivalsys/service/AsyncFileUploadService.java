package com.example.archivalsys.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.example.archivalsys.entity.FileEntity;
import com.example.archivalsys.entity.User;
import com.example.archivalsys.repository.FileRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;

@Service
public class AsyncFileUploadService {

    private final BlobContainerClient containerClient;
    private final FileRepository fileRepository;
    private final ArchivalService archivalService;

    public AsyncFileUploadService(BlobContainerClient containerClient,
                                  FileRepository fileRepository,
                                  ArchivalService archivalService) {
        this.containerClient = containerClient;
        this.fileRepository = fileRepository;
        this.archivalService = archivalService;
    }

    @Async("fileUploadExecutor")
    public void uploadSingleFile(
            byte[] fileBytes,
            String originalFileName,
            FileEntity entity
    ) {
        try {
            System.out.println(
                    "ASYNC Uploading " + originalFileName +
                            " | Thread: " + Thread.currentThread().getName()
            );

            String blobName = System.currentTimeMillis() + "_" + originalFileName;

            BlobClient blobClient = containerClient.getBlobClient(blobName);

            long start = System.currentTimeMillis();

            blobClient.upload(
                    new ByteArrayInputStream(fileBytes),
                    fileBytes.length,
                    true
            );

            long end = System.currentTimeMillis();

            entity.setBlobUrl(blobName);
            entity.setUploadedAt(LocalDateTime.now());
            entity.setUploadDurationMs(end - start);
            entity.setStatus("UPLOADED");

            fileRepository.save(entity);
            processFile(entity);

        } catch (Exception e) {
            entity.setStatus("FAILED");
            fileRepository.save(entity);
            e.printStackTrace();
        }
    }

    private void processFile(FileEntity file) {
        file.setStatus("PROCESSED");
        fileRepository.save(file);
        archivalService.archiveIfEligible(file);
    }
}
