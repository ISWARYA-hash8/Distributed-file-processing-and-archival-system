package com.example.archivalsys.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.models.AccessTier;
import com.example.archivalsys.entity.FileEntity;
import com.example.archivalsys.repository.FileRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ArchivalService {

    private static final long SIZE_THRESHOLD = 2 * 1024 * 1024; // 2 MB
    private static final int ARCHIVE_AFTER_DAYS = 7; // archive after 7 days

    private final BlobContainerClient hotContainerClient;
    private final FileRepository fileRepository;

    public ArchivalService(BlobContainerClient hotContainerClient,
                           FileRepository fileRepository) {
        this.hotContainerClient = hotContainerClient;
        this.fileRepository = fileRepository;
    }

    /**
     * Manual / Async archival trigger
     */
    public void archiveIfEligible(FileEntity file) {

        // Only PROCESSED files
        if (!"PROCESSED".equals(file.getStatus())) {
            return;

        }

        // Size-based rule
        if (file.getSize() < SIZE_THRESHOLD) {
            return;
        }

        try {
            BlobClient blobClient =
                    hotContainerClient.getBlobClient(file.getBlobUrl());

            // HOT → COOL tier
            blobClient.setAccessTier(AccessTier.COOL);

            file.setStatus("ARCHIVED");
            file.setArchivedAt(LocalDateTime.now());
            fileRepository.save(file);

            System.out.println("ARCHIVED (HOT → COOL): " + file.getFileName());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Scheduler-based archival (time rule)
     * Runs once per day
     */
    @Scheduled(cron = "0 0 2 * * ?") // daily at 2 AM
    public void archiveOldFiles() {

        LocalDateTime cutoffDate =
                LocalDateTime.now().minusDays(ARCHIVE_AFTER_DAYS);

        List<FileEntity> eligibleFiles =
                fileRepository.findByStatusAndUploadedAtBefore(
                        "PROCESSED", cutoffDate
                );

        for (FileEntity file : eligibleFiles) {
            archiveIfEligible(file);
        }

        System.out.println("Scheduled archival job completed");
    }
}
