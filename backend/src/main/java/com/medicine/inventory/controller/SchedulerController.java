package com.medicine.inventory.controller;

import com.medicine.inventory.service.MedicineSchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/internal/scheduler")
@RequiredArgsConstructor
public class SchedulerController {

    @Value("${scheduler.secret:}")
    private String schedulerSecret;

    private final MedicineSchedulerService medicineSchedulerService;

    @PostMapping("/run")
    public ResponseEntity<String> run(
            @RequestHeader(value = "X-Scheduler-Token", required = false) String token) {
        if (schedulerSecret.isEmpty() || !schedulerSecret.equals(token)) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        medicineSchedulerService.decrementDailyDose();
        return ResponseEntity.ok("OK");
    }
}
