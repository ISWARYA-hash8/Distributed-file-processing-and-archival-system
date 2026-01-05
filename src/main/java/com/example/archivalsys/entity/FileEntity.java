package com.example.archivalsys.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "files")
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    // Blob object name / URL
    private String blobUrl;

    private String contentType;

    private Long size;

    // UPLOADED, PROCESSED, ARCHIVED
    private String status;

    // Upload tracking
    private LocalDateTime uploadStartedAt;
    private LocalDateTime uploadedAt;
    private Long uploadDurationMs;

    // Archival info
    private LocalDateTime archivedAt;

    // File owner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
