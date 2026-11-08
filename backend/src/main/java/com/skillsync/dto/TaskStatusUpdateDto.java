package com.skillsync.dto;

import com.skillsync.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;

public class TaskStatusUpdateDto {

    @NotNull(message = "Task status is required")
    private TaskStatus status;

    private String verificationNotes;

    public TaskStatusUpdateDto() {}

    public TaskStatusUpdateDto(TaskStatus status, String verificationNotes) {
        this.status = status;
        this.verificationNotes = verificationNotes;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getVerificationNotes() {
        return verificationNotes;
    }

    public void setVerificationNotes(String verificationNotes) {
        this.verificationNotes = verificationNotes;
    }
}
