import React from 'react';

const Navbar = ({ currentUser, selectedEmployee, employees, onSelectEmployee, onLogout }) => {
  const isManager = currentUser?.role === 'ROLE_MANAGER';

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
          {/* Manager can switch between any employee; Developer only views their own */}
          {isManager ? (
            <div className="employee-picker">
              <label htmlFor="emp-select">Audit Developer:</label>
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
          ) : (
            <div className="developer-view-pill">
              <span className="dev-pill-label">Active Workspace:</span>
              <span className="dev-pill-name">{currentUser?.name} ({selectedEmployee?.employeeCode})</span>
            </div>
          )}

          <div className="user-profile-badge">
            <div className={`avatar ${isManager ? 'avatar-manager' : 'avatar-dev'}`}>
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser?.name}</span>
              <span className="user-role-badge">
                {isManager ? '👔 Manager (Admin)' : '💻 Developer'}
              </span>
            </div>
          </div>

          <button className="btn btn-sm btn-outline btn-logout" onClick={onLogout} title="Sign Out">
            Sign Out ⎋
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
