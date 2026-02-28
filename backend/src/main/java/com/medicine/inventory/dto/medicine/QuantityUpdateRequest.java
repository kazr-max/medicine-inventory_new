package com.medicine.inventory.dto.medicine;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuantityUpdateRequest {

    @NotNull(message = "deltaは必須です")
    private Integer delta;
}
