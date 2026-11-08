package com.skillsync.controller;

import com.skillsync.dto.TaskAssignRequestDto;
import com.skillsync.dto.TaskResponseDto;
import com.skillsync.dto.TaskStatusUpdateDto;
import com.skillsync.entity.TaskStatus;
import com.skillsync.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/assign")
    public ResponseEntity<TaskResponseDto> assignTask(@Valid @RequestBody TaskAssignRequestDto requestDto) {
        TaskResponseDto created = taskService.assignTask(requestDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskResponseDto> updateTaskStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskStatusUpdateDto updateDto) {
        TaskResponseDto updated = taskService.updateTaskStatus(taskId, updateDto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByEmployee(
            @PathVariable Long employeeId,
            @RequestParam(required = false) TaskStatus status) {
        return ResponseEntity.ok(taskService.getTasksByEmployeeId(employeeId, status));
    }

    @GetMapping("/pending/{employeeId}")
    public ResponseEntity<List<TaskResponseDto>> getPendingTasksForEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(taskService.getPendingTasksForEmployee(employeeId));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskById(taskId));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
