import React, { useState } from 'react';

const LoginPage = ({ onLogin, employees }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleManualLogin = (e) => {
    e.preventDefault();
    setError('');

    if (username.trim().toLowerCase() === 'manager' || username.includes('admin') || username.includes('manager@wipro.com')) {
      onLogin({
        role: 'ROLE_MANAGER',
        name: 'Anita Desai',
        designation: 'Lead Governance Auditor',
        employeeId: null,
      });
      return;
    }

    // Check if matching an employee
    const foundEmp = employees.find(
      (emp) =>
        emp.email.toLowerCase() === username.trim().toLowerCase() ||
        emp.employeeCode.toLowerCase() === username.trim().toLowerCase() ||
        emp.fullName.toLowerCase().includes(username.trim().toLowerCase())
    );

    if (foundEmp) {
      onLogin({
        role: 'ROLE_DEVELOPER',
        name: foundEmp.fullName,
        designation: foundEmp.designation,
        employeeId: foundEmp.id,
        employee: foundEmp,
      });
      return;
    }

    setError('Invalid credentials. Use Quick Login personas below or enter "manager" / "rohan".');
  };

  const handlePersonaLogin = (personaRole, empId = null) => {
    if (personaRole === 'ROLE_MANAGER') {
      onLogin({
        role: 'ROLE_MANAGER',
        name: 'Anita Desai',
        designation: 'Lead Governance Auditor',
        employeeId: null,
      });
    } else {
      const emp = employees.find((e) => e.id === empId) || employees[0];
      onLogin({
        role: 'ROLE_DEVELOPER',
        name: emp?.fullName || 'Rohan Sharma',
        designation: emp?.designation || 'Full Stack Developer',
        employeeId: emp?.id || 1,
        employee: emp,
      });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">⚡</div>
          <h2>SkillSync Enterprise</h2>
          <p className="login-subtext">Developer Onboarding & Regulatory Compliance Portal</p>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}

        <form onSubmit={handleManualLogin} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Corporate ID / Email
            </label>
            <input
              id="username"
              type="text"
              className="form-control"
              placeholder="e.g. manager@wipro.com or rohan"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign In with Enterprise SSO
          </button>
        </form>

        <div className="login-divider">
          <span>OR CHOOSE A DEMO PERSONA (RBAC)</span>
        </div>

        <div className="persona-grid">
          <div
            className="persona-card persona-manager"
            onClick={() => handlePersonaLogin('ROLE_MANAGER')}
          >
            <div className="persona-icon">👔</div>
            <div className="persona-info">
              <span className="persona-role">Manager / Lead Auditor</span>
              <span className="persona-desc">Department telemetry, assign tasks & audit proof approval</span>
            </div>
            <span className="persona-badge">Full Write Access</span>
          </div>

          <div
            className="persona-card persona-dev"
            onClick={() => handlePersonaLogin('ROLE_DEVELOPER', 1)}
          >
            <div className="persona-icon">💻</div>
            <div className="persona-info">
              <span className="persona-role">Developer: Rohan Sharma</span>
              <span className="persona-desc">L1 Full Stack • View personal tasks & submit compliance proof</span>
            </div>
            <span className="persona-badge">Developer Role</span>
          </div>

          <div
            className="persona-card persona-dev"
            onClick={() => handlePersonaLogin('ROLE_DEVELOPER', 2)}
          >
            <div className="persona-icon">🛡️</div>
            <div className="persona-info">
              <span className="persona-role">Developer: Priya Nair</span>
              <span className="persona-desc">L2 Cloud Backend • 100% compliant developer view</span>
            </div>
            <span className="persona-badge">Developer Role</span>
          </div>
        </div>

        <div className="login-footer">
          <p>Protected by Enterprise Role-Based Access Control (RBAC) • Spring Boot 3 & React 18</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
