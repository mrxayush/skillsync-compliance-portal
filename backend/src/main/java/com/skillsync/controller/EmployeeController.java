package com.skillsync.controller;

import com.skillsync.dto.DashboardMetricsDto;
import com.skillsync.dto.EmployeeSummaryDto;
import com.skillsync.entity.Employee;
import com.skillsync.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeSummaryDto>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeSummaryDto> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<DashboardMetricsDto> getEmployeeDashboardMetrics(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeDashboardMetrics(id));
    }

    @GetMapping("/at-risk")
    public ResponseEntity<List<EmployeeSummaryDto>> getAtRiskEmployees(
            @RequestParam(required = false, defaultValue = "70.0") Double threshold) {
        return ResponseEntity.ok(employeeService.getAtRiskEmployees(threshold));
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@Valid @RequestBody Employee employee) {
        Employee created = employeeService.createEmployee(employee);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
