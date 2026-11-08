package com.skillsync.service;

import com.skillsync.dto.DashboardMetricsDto;
import com.skillsync.dto.EmployeeSummaryDto;
import com.skillsync.entity.Employee;

import java.util.List;

public interface EmployeeService {

    List<EmployeeSummaryDto> getAllEmployees();

    EmployeeSummaryDto getEmployeeById(Long id);

    DashboardMetricsDto getEmployeeDashboardMetrics(Long employeeId);

    List<EmployeeSummaryDto> getAtRiskEmployees(Double threshold);

    Employee createEmployee(Employee employee);
}
