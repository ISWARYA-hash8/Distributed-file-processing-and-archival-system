package com.example.archivalsys.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.example.archivalsys.entity.FileEntity;
import com.example.archivalsys.entity.User;
import com.example.archivalsys.repository.FileRepository;
import com.example.archivalsys.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FileService {

    private final UserRepository userRepository;
    private final FileRepository fileRepository;
    private final AsyncFileUploadService asyncFileUploadService;
    private final BlobContainerClient hotContainerClient;
    private final BlobContainerClient archiveContainerClient;

    public FileService(UserRepository userRepository,
                       FileRepository fileRepository,
                       AsyncFileUploadService asyncFileUploadService,
                       BlobContainerClient hotContainerClient,
                       BlobContainerClient archiveContainerClient) {

        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
        this.asyncFileUploadService = asyncFileUploadService;
        this.hotContainerClient = hotContainerClient;
        this.archiveContainerClient = archiveContainerClient;
    }

    // MULTIPLE FILE UPLOAD (ASYNC)
    public void uploadFiles(List<MultipartFile> files) throws IOException {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        for (MultipartFile file : files) {

            byte[] fileBytes = file.getBytes(); // 🔥 detach temp file

            FileEntity entity = new FileEntity();
            entity.setFileName(file.getOriginalFilename());
            entity.setContentType(file.getContentType());
            entity.setSize(file.getSize());
            entity.setStatus("UPLOADING");
            entity.setUser(user);
            entity.setUploadStartedAt(LocalDateTime.now());

            fileRepository.save(entity);

            asyncFileUploadService.uploadSingleFile(
                    fileBytes,
                    file.getOriginalFilename(),
                    entity
            );
        }
    }

    // GET ALL FILES (LOGGED-IN USER)
    public List<FileEntity> getMyFiles() {

        User user = getLoggedInUser();
        return fileRepository.findByUser(user);
    }

    // GET FILE BY ID (SECURE)
    public FileEntity getFileById(Long id) {

        User user = getLoggedInUser();

        return fileRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    // GET ARCHIVED FILES
    public List<FileEntity> getArchivedFiles() {

        User user = getLoggedInUser();
        return fileRepository.findByUserAndStatus(user, "ARCHIVED");
    }

    // DOWNLOAD FILE (HOT / COOL aware)
    public byte[] downloadFile(Long id) {

        FileEntity file = getFileById(id);

        BlobContainerClient containerClient =
                resolveContainer(file);

        BlobClient blobClient =
                containerClient.getBlobClient(file.getBlobUrl());

        if (!blobClient.exists()) {
            throw new RuntimeException("Blob not found");
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        blobClient.download(outputStream);

        return outputStream.toByteArray();
    }

    // DELETE FILE (HOT / COOL aware)
    @Transactional
    public void deleteFile(Long id) {

        FileEntity file = getFileById(id);

        BlobContainerClient containerClient =
                resolveContainer(file);

        BlobClient blobClient =
                containerClient.getBlobClient(file.getBlobUrl());

        if (blobClient.exists()) {
            blobClient.delete();
        }

        fileRepository.delete(file);
    }

    // Helper: Logged-in user
    private User getLoggedInUser() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Helper: container resolver
    private BlobContainerClient resolveContainer(FileEntity file) {

        return "ARCHIVED".equals(file.getStatus())
                ? archiveContainerClient
                : hotContainerClient;
    }
}
