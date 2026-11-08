import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import ManagerDashboard from './pages/ManagerDashboard';
import LoginPage from './pages/LoginPage';
import { taskService } from './services/taskService';

function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Authentication State with localStorage persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skillsync_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  useEffect(() => {
    const initEmployees = async () => {
      try {
        setInitialLoading(true);
        const data = await taskService.getAllEmployees();
        setEmployees(data);
        if (data.length > 0) {
          // If logged in as developer, match their profile
          if (currentUser?.role === 'ROLE_DEVELOPER' && currentUser.employeeId) {
            const myProfile = data.find((e) => e.id === currentUser.employeeId);
            setSelectedEmployee(myProfile || data[0]);
          } else {
            setSelectedEmployee(data[0]); // Default to first employee for Manager
          }
        }
      } catch (err) {
        showNotification('Unable to fetch employees list. Backend may be offline.', 'error');
      } finally {
        setInitialLoading(false);
      }
    };

    initEmployees();
  }, [currentUser?.role, currentUser?.employeeId]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('skillsync_user', JSON.stringify(user));

    if (user.role === 'ROLE_DEVELOPER' && user.employeeId) {
      const match = employees.find((e) => e.id === user.employeeId);
      if (match) setSelectedEmployee(match);
    } else if (employees.length > 0) {
      setSelectedEmployee(employees[0]);
    }

    showNotification(`Signed in as ${user.name} (${user.role === 'ROLE_MANAGER' ? 'Manager Console' : 'Developer View'})`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('skillsync_user');
    showNotification('Signed out of SkillSync Enterprise session.', 'info');
  };

  // If not authenticated, show Login Screen with Demo Personas
  if (!currentUser) {
    return (
      <div className="app-root auth-view">
        {notification && (
          <div className={`toast-notification toast-${notification.type}`}>
            <span>{notification.message}</span>
            <button className="toast-close" onClick={() => setNotification(null)}>✕</button>
          </div>
        )}
        <LoginPage onLogin={handleLogin} employees={employees} />
      </div>
    );
  }

  return (
    <div className="app-root">
      <Navbar
        currentUser={currentUser}
        selectedEmployee={selectedEmployee}
        employees={employees}
        onSelectEmployee={(emp) => setSelectedEmployee(emp)}
        onLogout={handleLogout}
      />

      {notification && (
        <div className={`toast-notification toast-${notification.type}`}>
          <span>{notification.message}</span>
          <button className="toast-close" onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      <main className="main-content">
        {initialLoading && !selectedEmployee ? (
          <div className="state-panel loading-state">
            <div className="spinner"></div>
            <p>Initializing SkillSync Enterprise Portal...</p>
            <p className="hint">Waking up cloud backend (takes ~30s on initial load)...</p>
          </div>
        ) : (
          <ManagerDashboard
            currentUser={currentUser}
            selectedEmployee={selectedEmployee}
            onNotification={showNotification}
          />
        )}
      </main>

      <footer className="footer">
        <p>SkillSync Enterprise Task & Compliance Portal • Role-Based Access Control (RBAC) • Spring Boot 3 & React 18</p>
      </footer>
    </div>
  );
}

export default App;
