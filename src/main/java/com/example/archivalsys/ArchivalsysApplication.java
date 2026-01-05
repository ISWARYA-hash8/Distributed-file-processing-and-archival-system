package com.example.archivalsys;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
@SpringBootApplication
@EnableAsync
public class ArchivalsysApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArchivalsysApplication.class, args);
	}

}
