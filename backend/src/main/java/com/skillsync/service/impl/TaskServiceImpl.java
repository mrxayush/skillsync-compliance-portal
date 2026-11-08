package com.skillsync.service.impl;

import com.skillsync.dto.TaskAssignRequestDto;
import com.skillsync.dto.TaskResponseDto;
import com.skillsync.dto.TaskStatusUpdateDto;
import com.skillsync.entity.ComplianceTask;
import com.skillsync.entity.Employee;
import com.skillsync.entity.TaskStatus;
import com.skillsync.exception.ResourceNotFoundException;
import com.skillsync.repository.ComplianceTaskRepository;
import com.skillsync.repository.EmployeeRepository;
import com.skillsync.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final ComplianceTaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;

    public TaskServiceImpl(ComplianceTaskRepository taskRepository, EmployeeRepository employeeRepository) {
        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional
    public TaskResponseDto assignTask(TaskAssignRequestDto requestDto) {
        Employee employee = employeeRepository.findById(requestDto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + requestDto.getEmployeeId()));

        ComplianceTask task = new ComplianceTask();
        task.setTitle(requestDto.getTitle());
        task.setDescription(requestDto.getDescription());
        task.setCategory(requestDto.getCategory());
        task.setStatus(TaskStatus.PENDING);
        task.setDueDate(requestDto.getDueDate());
        task.setEmployee(employee);

        ComplianceTask saved = taskRepository.save(task);

        // Recalculate employee compliance score
        recalculateComplianceScore(employee);

        return mapToDto(saved);
    }

    @Override
    @Transactional
    public TaskResponseDto updateTaskStatus(Long taskId, TaskStatusUpdateDto updateDto) {
        ComplianceTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Compliance task not found with id: " + taskId));

        task.setStatus(updateDto.getStatus());
        if (updateDto.getVerificationNotes() != null) {
            task.setVerificationNotes(updateDto.getVerificationNotes());
        }

        if (updateDto.getStatus() == TaskStatus.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
        } else {
            task.setCompletedAt(null);
        }

        ComplianceTask updated = taskRepository.save(task);

        // Recalculate employee compliance score atomically
        recalculateComplianceScore(updated.getEmployee());

        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getTasksByEmployeeId(Long employeeId, TaskStatus status) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found with id: " + employeeId);
        }

        List<ComplianceTask> tasks;
        if (status != null) {
            tasks = taskRepository.findByEmployeeIdAndStatus(employeeId, status);
        } else {
            tasks = taskRepository.findByEmployeeIdOrderByDueDateAsc(employeeId);
        }

        return tasks.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getPendingTasksForEmployee(Long employeeId) {
        return getTasksByEmployeeId(employeeId, TaskStatus.PENDING);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponseDto getTaskById(Long taskId) {
        ComplianceTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        return mapToDto(task);
    }

    @Override
    @Transactional
    public void deleteTask(Long taskId) {
        ComplianceTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        Employee employee = task.getEmployee();
        taskRepository.delete(task);
        recalculateComplianceScore(employee);
    }

    private void recalculateComplianceScore(Employee employee) {
        long totalTasks = taskRepository.countByEmployeeId(employee.getId());
        long completedTasks = taskRepository.countByEmployeeIdAndStatus(employee.getId(), TaskStatus.COMPLETED);

        double score = 0.0;
        if (totalTasks > 0) {
            score = Math.round(((double) completedTasks / totalTasks) * 1000.0) / 10.0;
        }

        employee.setComplianceScore(score);
        employeeRepository.save(employee);
    }

    private TaskResponseDto mapToDto(ComplianceTask task) {
        return new TaskResponseDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getCategory().name(),
                task.getStatus().name(),
                task.getDueDate(),
                task.getCompletedAt(),
                task.getVerificationNotes(),
                task.getEmployee().getId(),
                task.getEmployee().getFullName()
        );
    }
}
