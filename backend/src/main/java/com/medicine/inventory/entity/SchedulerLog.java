package com.medicine.inventory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "scheduler_log")
@Getter
@Setter
@NoArgsConstructor
public class SchedulerLog {

    @Id
    private Long id = 1L;

    @Column(name = "last_decrement_date", nullable = false)
    private LocalDate lastDecrementDate;
}
