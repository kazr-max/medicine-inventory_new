package com.medicine.inventory.service;

import com.medicine.inventory.entity.Medicine;
import com.medicine.inventory.entity.UsageType;
import com.medicine.inventory.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(MedicineSchedulerService.class);

    private final MedicineRepository medicineRepository;
    private final LineNotificationService lineNotificationService;

    @Transactional
    public void decrementDailyDose() {
        List<Medicine> medicines = medicineRepository
                .findByUsageTypeAndQuantityGreaterThanAndDailyDoseGreaterThan(UsageType.REGULAR, 0, 0);

        log.info("常用薬の自動減算開始: 対象 {} 件", medicines.size());

        for (Medicine medicine : medicines) {
            int oldQuantity = medicine.getQuantity();
            int newQuantity = Math.max(0, oldQuantity - medicine.getDailyDose());
            medicine.setQuantity(newQuantity);

            if (oldQuantity > medicine.getAlertThreshold()
                    && newQuantity <= medicine.getAlertThreshold()) {
                lineNotificationService.notifyLowStock(medicine);
            }

            log.info("薬「{}」: {} → {} (dailyDose={})",
                    medicine.getName(), oldQuantity, newQuantity, medicine.getDailyDose());
        }

        medicineRepository.saveAll(medicines);
        log.info("常用薬の自動減算完了");
    }
}
