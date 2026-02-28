package com.medicine.inventory.dto.medicine;

import com.medicine.inventory.entity.Medicine;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class MedicineResponse {

    private final Long id;
    private final Long userId;
    private final String name;
    private final String usageType;
    private final Integer quantity;
    private final LocalDate expirationDate;
    private final Integer dailyDose;
    private final Integer alertThreshold;
    private final String stockStatus;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public MedicineResponse(Medicine medicine) {
        this.id = medicine.getId();
        this.userId = medicine.getUser().getId();
        this.name = medicine.getName();
        this.usageType = medicine.getUsageType().name();
        this.quantity = medicine.getQuantity();
        this.expirationDate = medicine.getExpirationDate();
        this.dailyDose = medicine.getDailyDose();
        this.alertThreshold = medicine.getAlertThreshold();
        this.stockStatus = calculateStockStatus(medicine.getQuantity(), medicine.getAlertThreshold());
        this.createdAt = medicine.getCreatedAt();
        this.updatedAt = medicine.getUpdatedAt();
    }

    private static String calculateStockStatus(int quantity, int alertThreshold) {
        if (alertThreshold == 0) {
            return quantity > 0 ? "NORMAL" : "CRITICAL";
        }
        if (quantity > alertThreshold) {
            return "NORMAL";
        }
        int criticalThreshold = (int) Math.ceil(alertThreshold / 2.0);
        if (quantity <= criticalThreshold) {
            return "CRITICAL";
        }
        return "LOW";
    }
}
