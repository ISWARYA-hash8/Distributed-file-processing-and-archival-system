package com.example.archivalsys.controller;

import com.example.archivalsys.entity.FileEntity;
import com.example.archivalsys.service.FileService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = {"Authorization","Content-Type","Accept"},
        allowCredentials = "true")
@RestController
@RequestMapping("/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    // HOST CHECK
    @GetMapping("/")
    public String hostpage() {
        return "local host is running";
    }

    //  MULTIPLE FILE UPLOAD (FIXED)
    @PostMapping("/upload")
    public String uploadFiles(@RequestParam("files") MultipartFile[] files)
            throws Exception {

        // convert array → list (required by service)
        fileService.uploadFiles(Arrays.asList(files));
        return "File upload started";
    }

    // GET ALL FILES (path fix)
    @GetMapping("/all")
    public List<FileEntity> getAllFiles() {
        return fileService.getMyFiles();
    }

    // GET FILE BY ID
    @GetMapping("/{id}")
    public FileEntity getFileById(@PathVariable Long id) {
        return fileService.getFileById(id);
    }
    @GetMapping("/archived")
    public ResponseEntity<List<FileEntity>> getArchivedFiles() {
        return ResponseEntity.ok(fileService.getArchivedFiles());
    }


    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {

        FileEntity file = fileService.getFileById(id); // user-ownership check already exists

        byte[] data = fileService.downloadFile(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable Long id) {

        fileService.deleteFile(id);
        return ResponseEntity.ok("File deleted successfully");
    }



}
