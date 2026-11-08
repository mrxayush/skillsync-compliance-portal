package com.skillsync.repository;

import com.skillsync.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmployeeCode(String employeeCode);

    Optional<Employee> findByEmail(String email);

    // Identifies developers below threshold compliance for proactive escalation
    List<Employee> findByComplianceScoreLessThan(Double threshold);

    // Eagerly fetches tasks to eliminate N+1 queries when loading full profile
    @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.tasks WHERE e.id = :id")
    Optional<Employee> findByIdWithTasks(@Param("id") Long id);
}
