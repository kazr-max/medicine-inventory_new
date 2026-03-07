package com.medicine.inventory.repository;

import com.medicine.inventory.entity.SchedulerLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchedulerLogRepository extends JpaRepository<SchedulerLog, Long> {
}
