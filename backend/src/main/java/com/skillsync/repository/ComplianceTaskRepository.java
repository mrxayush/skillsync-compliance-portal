package com.skillsync.repository;

import com.skillsync.entity.ComplianceTask;
import com.skillsync.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ComplianceTaskRepository extends JpaRepository<ComplianceTask, Long> {

    // Derived query for pending tasks for a specific developer
    List<ComplianceTask> findByEmployeeIdAndStatus(Long employeeId, TaskStatus status);

    // All tasks for an employee sorted by due date
    List<ComplianceTask> findByEmployeeIdOrderByDueDateAsc(Long employeeId);

    // Count queries for calculating real-time dashboard completion metrics
    long countByEmployeeIdAndStatus(Long employeeId, TaskStatus status);

    long countByEmployeeId(Long employeeId);

    // Custom JPQL query to find non-completed overdue tasks for an employee
    @Query("SELECT t FROM ComplianceTask t WHERE t.employee.id = :employeeId AND t.dueDate < :today AND t.status != 'COMPLETED'")
    List<ComplianceTask> findOverdueTasksForEmployee(@Param("employeeId") Long employeeId, @Param("today") LocalDate today);

    // System-wide overdue tasks
    @Query("SELECT t FROM ComplianceTask t WHERE t.dueDate < :today AND t.status != 'COMPLETED'")
    List<ComplianceTask> findAllOverdueTasks(@Param("today") LocalDate today);
}
