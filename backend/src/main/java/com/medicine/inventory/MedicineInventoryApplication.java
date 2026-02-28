package com.medicine.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MedicineInventoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedicineInventoryApplication.class, args);
    }
}
