package com.skillsync.service.impl;

import com.skillsync.dto.DashboardMetricsDto;
import com.skillsync.dto.EmployeeSummaryDto;
import com.skillsync.entity.Employee;
import com.skillsync.entity.TaskStatus;
import com.skillsync.exception.ResourceNotFoundException;
import com.skillsync.repository.ComplianceTaskRepository;
import com.skillsync.repository.EmployeeRepository;
import com.skillsync.service.EmployeeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final ComplianceTaskRepository taskRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, ComplianceTaskRepository taskRepository) {
        this.employeeRepository = employeeRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeSummaryDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeSummaryDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return mapToSummaryDto(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardMetricsDto getEmployeeDashboardMetrics(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        long total = taskRepository.countByEmployeeId(employeeId);
        long completed = taskRepository.countByEmployeeIdAndStatus(employeeId, TaskStatus.COMPLETED);
        long pending = taskRepository.countByEmployeeIdAndStatus(employeeId, TaskStatus.PENDING);
        long inProgress = taskRepository.countByEmployeeIdAndStatus(employeeId, TaskStatus.IN_PROGRESS);
        long overdue = taskRepository.findOverdueTasksForEmployee(employeeId, LocalDate.now()).size();

        return new DashboardMetricsDto(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getFullName(),
                employee.getDepartment(),
                employee.getDesignation(),
                total,
                completed,
                pending,
                inProgress,
                overdue,
                employee.getComplianceScore()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeSummaryDto> getAtRiskEmployees(Double threshold) {
        double cutOff = (threshold != null) ? threshold : 70.0;
        return employeeRepository.findByComplianceScoreLessThan(cutOff).stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    private EmployeeSummaryDto mapToSummaryDto(Employee employee) {
        long total = taskRepository.countByEmployeeId(employee.getId());
        long completed = taskRepository.countByEmployeeIdAndStatus(employee.getId(), TaskStatus.COMPLETED);
        return new EmployeeSummaryDto(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getFullName(),
                employee.getEmail(),
                employee.getDepartment(),
                employee.getDesignation(),
                employee.getComplianceScore(),
                total,
                completed
        );
    }
}
