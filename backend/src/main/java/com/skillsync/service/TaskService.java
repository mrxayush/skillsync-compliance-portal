package com.skillsync.service;

import com.skillsync.dto.TaskAssignRequestDto;
import com.skillsync.dto.TaskResponseDto;
import com.skillsync.dto.TaskStatusUpdateDto;
import com.skillsync.entity.TaskStatus;

import java.util.List;

public interface TaskService {

    TaskResponseDto assignTask(TaskAssignRequestDto requestDto);

    TaskResponseDto updateTaskStatus(Long taskId, TaskStatusUpdateDto updateDto);

    List<TaskResponseDto> getTasksByEmployeeId(Long employeeId, TaskStatus status);

    List<TaskResponseDto> getPendingTasksForEmployee(Long employeeId);

    TaskResponseDto getTaskById(Long taskId);

    void deleteTask(Long taskId);
}
