package com.medicine.inventory.controller;

import com.medicine.inventory.dto.medicine.MedicineRequest;
import com.medicine.inventory.dto.medicine.MedicineResponse;
import com.medicine.inventory.dto.medicine.QuantityUpdateRequest;
import com.medicine.inventory.service.MedicineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @GetMapping
    public List<MedicineResponse> getMedicines(
            @PathVariable Long userId,
            @RequestParam(required = false) String search) {
        return medicineService.getMedicines(userId, search);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedicineResponse createMedicine(
            @PathVariable Long userId,
            @Valid @RequestBody MedicineRequest request) {
        return medicineService.createMedicine(userId, request);
    }

    @PutMapping("/{id}")
    public MedicineResponse updateMedicine(
            @PathVariable Long userId,
            @PathVariable Long id,
            @Valid @RequestBody MedicineRequest request) {
        return medicineService.updateMedicine(userId, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMedicine(
            @PathVariable Long userId,
            @PathVariable Long id) {
        medicineService.deleteMedicine(userId, id);
    }

    @PatchMapping("/{id}/quantity")
    public MedicineResponse updateQuantity(
            @PathVariable Long userId,
            @PathVariable Long id,
            @Valid @RequestBody QuantityUpdateRequest request) {
        return medicineService.updateQuantity(userId, id, request);
    }
}
