package com.medicine.inventory.dto.medicine;

import com.medicine.inventory.entity.UsageType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MedicineRequest {

    @NotBlank(message = "薬名は必須です")
    private String name;

    private UsageType usageType = UsageType.REGULAR;

    @NotNull(message = "数量は必須です")
    @Min(value = 0, message = "数量は0以上で入力してください")
    private Integer quantity;

    private LocalDate expirationDate;

    @Min(value = 0, message = "1日の服用数は0以上で入力してください")
    private Integer dailyDose = 0;

    @NotNull(message = "アラート閾値は必須です")
    @Min(value = 0, message = "アラート閾値は0以上で入力してください")
    private Integer alertThreshold;
}
