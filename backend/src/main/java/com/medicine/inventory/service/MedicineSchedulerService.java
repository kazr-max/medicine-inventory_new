package com.medicine.inventory.service;

import com.medicine.inventory.entity.Medicine;
import com.medicine.inventory.entity.SchedulerLog;
import com.medicine.inventory.entity.UsageType;
import com.medicine.inventory.repository.MedicineRepository;
import com.medicine.inventory.repository.SchedulerLogRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MedicineSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(MedicineSchedulerService.class);

    private final MedicineRepository medicineRepository;
    private final LineNotificationService lineNotificationService;
    private final SchedulerLogRepository schedulerLogRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void checkAndDecrementOnStartup() {
        LocalDate today = LocalDate.now();
        Optional<SchedulerLog> logOpt = schedulerLogRepository.findById(1L);

        int days;
        if (logOpt.isEmpty()) {
            days = 1;
        } else {
            LocalDate lastDate = logOpt.get().getLastDecrementDate();
            days = (int) ChronoUnit.DAYS.between(lastDate, today);
            if (days <= 0) {
                log.info("本日の自動減算は既に完了しています");
                return;
            }
        }

        decrementDailyDose(days);

        SchedulerLog schedulerLog = logOpt.orElse(new SchedulerLog());
        schedulerLog.setLastDecrementDate(today);
        schedulerLogRepository.save(schedulerLog);
    }

    @Transactional
    public void decrementDailyDose(int days) {
        List<Medicine> medicines = medicineRepository
                .findByUsageTypeAndQuantityGreaterThanAndDailyDoseGreaterThan(UsageType.REGULAR, 0, 0);

        log.info("常用薬の自動減算開始: 対象 {} 件, {} 日分", medicines.size(), days);

        for (Medicine medicine : medicines) {
            int oldQuantity = medicine.getQuantity();
            int newQuantity = Math.max(0, oldQuantity - medicine.getDailyDose() * days);
            medicine.setQuantity(newQuantity);

            if (oldQuantity > medicine.getAlertThreshold()
                    && newQuantity <= medicine.getAlertThreshold()) {
                lineNotificationService.notifyLowStock(medicine);
            }

            log.info("薬「{}」: {} → {} (dailyDose={} × {}日)",
                    medicine.getName(), oldQuantity, newQuantity, medicine.getDailyDose(), days);
        }

        medicineRepository.saveAll(medicines);
        log.info("常用薬の自動減算完了");
    }
}
