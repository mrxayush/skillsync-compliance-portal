import React from 'react';

const Navbar = ({ selectedEmployee, employees, onSelectEmployee }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">⚡</div>
          <div className="brand-text">
            <span className="brand-title">SkillSync</span>
            <span className="brand-subtitle">Compliance & Onboarding Portal</span>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="employee-picker">
            <label htmlFor="emp-select">Switch Developer Profile:</label>
            <select
              id="emp-select"
              value={selectedEmployee?.id || ''}
              onChange={(e) => {
                const found = employees.find((emp) => emp.id === Number(e.target.value));
                if (found) onSelectEmployee(found);
              }}
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.employeeCode}) - {emp.department}
                </option>
              ))}
            </select>
          </div>

          <div className="user-profile-badge">
            <div className="avatar">AD</div>
            <div className="user-info">
              <span className="user-name">Manager Console</span>
              <span className="user-role">Lead Auditor</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
