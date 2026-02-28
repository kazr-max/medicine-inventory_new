package com.medicine.inventory.repository;

import com.medicine.inventory.entity.Medicine;
import com.medicine.inventory.entity.UsageType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByUserIdOrderByIdDesc(Long userId);

    List<Medicine> findByUserIdAndNameContainingIgnoreCaseOrderByIdDesc(Long userId, String name);

    Optional<Medicine> findByIdAndUserId(Long id, Long userId);

    List<Medicine> findByUsageTypeAndQuantityGreaterThanAndDailyDoseGreaterThan(
            UsageType usageType, Integer quantity, Integer dailyDose);
}
