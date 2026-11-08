package com.skillsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SkillSyncApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillSyncApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 SkillSync Backend successfully started on http://localhost:8080");
        System.out.println("📊 H2 Console available at: http://localhost:8080/h2-console");
        System.out.println("=================================================");
    }
}
