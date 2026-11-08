import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import ManagerDashboard from './pages/ManagerDashboard';
import { taskService } from './services/taskService';

function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notification, setNotification] = useState(null);

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
          setSelectedEmployee(data[0]); // Default to first employee
        }
      } catch (err) {
        showNotification('Unable to fetch employees list. Backend may be offline.', 'error');
      } finally {
        setInitialLoading(false);
      }
    };

    initEmployees();
  }, []);

  return (
    <div className="app-root">
      <Navbar
        selectedEmployee={selectedEmployee}
        employees={employees}
        onSelectEmployee={(emp) => setSelectedEmployee(emp)}
      />

      {notification && (
        <div className={`toast-notification toast-${notification.type}`}>
          <span>{notification.message}</span>
          <button className="toast-close" onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      <main className="main-content">
        {initialLoading ? (
          <div className="state-panel loading-state">
            <div className="spinner"></div>
            <p>Initializing SkillSync Enterprise Portal...</p>
            <p className="hint">Waking up cloud backend (takes ~30s on initial load)...</p>
          </div>
        ) : (
          <ManagerDashboard
            selectedEmployee={selectedEmployee}
            onNotification={showNotification}
          />
        )}
      </main>

      <footer className="footer">
        <p>SkillSync Enterprise Task & Compliance Portal • Built with Spring Boot 3 & React 18</p>
      </footer>
    </div>
  );
}

export default App;
