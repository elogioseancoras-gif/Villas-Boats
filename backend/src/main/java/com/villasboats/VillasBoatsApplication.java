package com.villasboats;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.villasboats.domain.repository")
@EntityScan(basePackages = "com.villasboats.domain.entity")
public class VillasBoatsApplication {

    public static void main(String[] args) {
        SpringApplication.run(VillasBoatsApplication.class, args);
    }
}
