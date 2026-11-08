package com.skillsync.config;

import com.skillsync.entity.ComplianceTask;
import com.skillsync.entity.Employee;
import com.skillsync.entity.TaskCategory;
import com.skillsync.entity.TaskStatus;
import com.skillsync.repository.ComplianceTaskRepository;
import com.skillsync.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final ComplianceTaskRepository taskRepository;

    public DataInitializer(EmployeeRepository employeeRepository, ComplianceTaskRepository taskRepository) {
        this.employeeRepository = employeeRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) {
        if (employeeRepository.count() > 0) {
            return;
        }

        // 1. Create Primary Demo Employee
        Employee emp1 = new Employee(
                null,
                "WIPRO-1042",
                "Rohan Sharma",
                "rohan.sharma@wipro.com",
                "Cloud & Enterprise Architecture",
                "Full Stack Developer (L1)",
                0.0
        );
        emp1 = employeeRepository.save(emp1);

        // Tasks for Rohan Sharma
        ComplianceTask t1 = new ComplianceTask(
                null,
                "Information Security (InfoSec 101) Certification",
                "Complete the mandatory corporate information security e-learning module and upload certificate.",
                TaskCategory.INFOSEC,
                TaskStatus.COMPLETED,
                LocalDate.now().plusDays(2),
                LocalDateTime.now().minusDays(1),
                "Certificate uploaded: CERT-SEC-99214. Verified score 98%.",
                emp1
        );

        ComplianceTask t2 = new ComplianceTask(
                null,
                "Workstation Provisioning & SSH Key Attestation",
                "Configure company-issued laptop with BitLocker, generate ed25519 SSH keys, and register with Enterprise GitHub.",
                TaskCategory.ENVIRONMENT_SETUP,
                TaskStatus.COMPLETED,
                LocalDate.now().plusDays(4),
                LocalDateTime.now().minusHours(5),
                "Registered SSH Fingerprint SHA256:7b+22fK99aK to GitHub Org.",
                emp1
        );

        ComplianceTask t3 = new ComplianceTask(
                null,
                "Git Branching & Pull Request Review Guidelines",
                "Review the Wipro engineering handbook on trunk-based development and conventional commit standards.",
                TaskCategory.CODE_STANDARDS,
                TaskStatus.IN_PROGRESS,
                LocalDate.now().plusDays(5),
                null,
                "Currently reviewing section 4: semantic versioning.",
                emp1
        );

        ComplianceTask t4 = new ComplianceTask(
                null,
                "Client Data Privacy & NDA E-Signature",
                "Sign the non-disclosure agreement and client confidential data handling agreement via DocuSign.",
                TaskCategory.HR_POLICY,
                TaskStatus.PENDING,
                LocalDate.now().plusDays(7),
                null,
                null,
                emp1
        );

        ComplianceTask t5 = new ComplianceTask(
                null,
                "Client Sandbox VPN & Firewall Access Validation",
                "Verify Cisco AnyConnect VPN connectivity to client development enclave and run smoke test ping.",
                TaskCategory.ENVIRONMENT_SETUP,
                TaskStatus.PENDING,
                LocalDate.now().plusDays(10),
                null,
                null,
                emp1
        );

        taskRepository.save(t1);
        taskRepository.save(t2);
        taskRepository.save(t3);
        taskRepository.save(t4);
        taskRepository.save(t5);

        // Update Rohan's score: 2 out of 5 completed = 40.0%
        emp1.setComplianceScore(40.0);
        employeeRepository.save(emp1);

        // 2. Create Second Employee (Senior Dev - High Compliance)
        Employee emp2 = new Employee(
                null,
                "WIPRO-1088",
                "Priya Nair",
                "priya.nair@wipro.com",
                "Financial Services & Banking",
                "Java Backend Specialist (L2)",
                100.0
        );
        emp2 = employeeRepository.save(emp2);

        ComplianceTask t6 = new ComplianceTask(
                null,
                "PCI-DSS Security Fundamentals",
                "Payment card industry compliance training for banking unit developers.",
                TaskCategory.INFOSEC,
                TaskStatus.COMPLETED,
                LocalDate.now().minusDays(3),
                LocalDateTime.now().minusDays(4),
                "PCI-DSS 4.0 exam cleared with 100%.",
                emp2
        );

        ComplianceTask t7 = new ComplianceTask(
                null,
                "Production Bastion Host Access Clearance",
                "MFA enrollment and YubiKey configuration for production jumpserver.",
                TaskCategory.ENVIRONMENT_SETUP,
                TaskStatus.COMPLETED,
                LocalDate.now().minusDays(1),
                LocalDateTime.now().minusDays(2),
                "YubiKey hardware token paired and verified.",
                emp2
        );
        taskRepository.save(t6);
        taskRepository.save(t7);

        // 3. Create Third Employee (At Risk - Overdue)
        Employee emp3 = new Employee(
                null,
                "WIPRO-1105",
                "Aman Verma",
                "aman.verma@wipro.com",
                "Healthcare & Life Sciences",
                "Frontend Engineer (L1)",
                0.0
        );
        emp3 = employeeRepository.save(emp3);

        ComplianceTask t8 = new ComplianceTask(
                null,
                "HIPAA Compliance & Protected Health Information (PHI) Handling",
                "Federal health privacy training mandatory before accessing patient portal codebases.",
                TaskCategory.INFOSEC,
                TaskStatus.OVERDUE,
                LocalDate.now().minusDays(2),
                null,
                "Pending manager follow-up.",
                emp3
        );
        taskRepository.save(t8);

        System.out.println(">>> SkillSync Seed Data successfully initialized with 3 employees and 8 compliance tasks! <<<");
    }
}
