package com.medicine.inventory.service;

import com.medicine.inventory.dto.medicine.MedicineRequest;
import com.medicine.inventory.dto.medicine.MedicineResponse;
import com.medicine.inventory.dto.medicine.QuantityUpdateRequest;
import com.medicine.inventory.entity.Medicine;
import com.medicine.inventory.entity.User;
import com.medicine.inventory.exception.ResourceNotFoundException;
import com.medicine.inventory.repository.MedicineRepository;
import com.medicine.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final LineNotificationService lineNotificationService;

    public List<MedicineResponse> getMedicines(Long userId, String search) {
        List<Medicine> medicines;
        if (search != null && !search.isBlank()) {
            medicines = medicineRepository.findByUserIdAndNameContainingIgnoreCaseOrderByIdDesc(userId, search.trim());
        } else {
            medicines = medicineRepository.findByUserIdOrderByIdDesc(userId);
        }
        return medicines.stream().map(MedicineResponse::new).toList();
    }

    @Transactional
    public MedicineResponse createMedicine(Long userId, MedicineRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + userId));

        Medicine medicine = new Medicine();
        medicine.setUser(user);
        medicine.setName(request.getName());
        medicine.setUsageType(request.getUsageType());
        medicine.setQuantity(request.getQuantity());
        medicine.setExpirationDate(request.getExpirationDate());
        medicine.setDailyDose(request.getDailyDose());
        medicine.setAlertThreshold(request.getAlertThreshold());

        medicine = medicineRepository.save(medicine);
        return new MedicineResponse(medicine);
    }

    @Transactional
    public MedicineResponse updateMedicine(Long userId, Long medicineId, MedicineRequest request) {
        Medicine medicine = findMedicine(userId, medicineId);

        medicine.setName(request.getName());
        medicine.setUsageType(request.getUsageType());
        medicine.setQuantity(request.getQuantity());
        medicine.setExpirationDate(request.getExpirationDate());
        medicine.setDailyDose(request.getDailyDose());
        medicine.setAlertThreshold(request.getAlertThreshold());

        medicine = medicineRepository.save(medicine);
        return new MedicineResponse(medicine);
    }

    @Transactional
    public void deleteMedicine(Long userId, Long medicineId) {
        Medicine medicine = findMedicine(userId, medicineId);
        medicineRepository.delete(medicine);
    }

    @Transactional
    public MedicineResponse updateQuantity(Long userId, Long medicineId, QuantityUpdateRequest request) {
        Medicine medicine = findMedicine(userId, medicineId);

        int oldQuantity = medicine.getQuantity();
        int newQuantity = oldQuantity + request.getDelta();
        if (newQuantity < 0) {
            throw new IllegalArgumentException("在庫数を0未満にすることはできません");
        }

        medicine.setQuantity(newQuantity);
        medicine = medicineRepository.save(medicine);

        // LINE通知: 減少時に閾値を下回った瞬間のみ通知
        if (request.getDelta() < 0
                && oldQuantity > medicine.getAlertThreshold()
                && newQuantity <= medicine.getAlertThreshold()) {
            lineNotificationService.notifyLowStock(medicine);
        }

        return new MedicineResponse(medicine);
    }

    private Medicine findMedicine(Long userId, Long medicineId) {
        return medicineRepository.findByIdAndUserId(medicineId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("薬が見つかりません: " + medicineId));
    }
}
