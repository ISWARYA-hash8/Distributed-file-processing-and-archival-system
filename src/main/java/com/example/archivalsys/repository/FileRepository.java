package com.example.archivalsys.repository;

import com.example.archivalsys.entity.FileEntity;
import com.example.archivalsys.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<FileEntity, Long> {

    // Get files of a specific user
    List<FileEntity> findByUser(User user);

    // Used for archival logic
    List<FileEntity> findByStatusAndUploadedAtBefore(
            String status,
            LocalDateTime time
    );
    Optional<FileEntity> findByIdAndUser(Long id, User user);

    List<FileEntity> findByUserAndStatus(User user, String status);
    long countByUserEmailAndStatus(String userEmail,String status);
}
