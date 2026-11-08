import React, { useState, useEffect, useCallback } from 'react';
import MetricGrid from '../components/dashboard/MetricGrid';
import TaskTable from '../components/dashboard/TaskTable';
import TaskStatusUpdateModal from '../components/tasks/TaskStatusUpdateModal';
import AssignTaskModal from '../components/tasks/AssignTaskModal';
import { taskService } from '../services/taskService';

const ManagerDashboard = ({ selectedEmployee, onNotification }) => {
  const [metrics, setMetrics] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTaskForEdit, setActiveTaskForEdit] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Load metrics and tasks for currently active developer
  const fetchDashboardData = useCallback(async () => {
    if (!selectedEmployee?.id) return;
    try {
      setLoading(true);
      setError(null);
      const [metricsData, tasksData] = await Promise.all([
        taskService.getEmployeeDashboardMetrics(selectedEmployee.id),
        taskService.getTasksByEmployee(selectedEmployee.id),
      ]);
      setMetrics(metricsData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Error loading compliance telemetry.');
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleTaskUpdated = (msg) => {
    setActiveTaskForEdit(null);
    onNotification(msg, 'success');
    fetchDashboardData();
  };

  const handleTaskAssigned = (msg) => {
    setIsAssignModalOpen(false);
    onNotification(msg, 'success');
    fetchDashboardData();
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to remove this compliance task?')) {
      try {
        await taskService.deleteTask(taskId);
        onNotification('Compliance task removed successfully.', 'info');
        fetchDashboardData();
      } catch (err) {
        onNotification(err.message || 'Failed to delete task.', 'error');
      }
    }
  };

  if (loading && !metrics) {
    return (
      <div className="state-panel loading-state">
        <div className="spinner"></div>
        <p>Synchronizing compliance telemetry from Spring Boot backend...</p>
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="state-panel error-state">
        <div className="error-icon">⚠️</div>
        <h3>Unable to reach SkillSync Backend</h3>
        <p>{error}</p>
        <p className="hint">Make sure Spring Boot backend is running on <code>http://localhost:8080</code></p>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Developer Profile Header Card */}
      <section className="profile-banner">
        <div className="profile-details">
          <div className="profile-avatar">
            {selectedEmployee?.fullName ? selectedEmployee.fullName.charAt(0) : 'D'}
          </div>
          <div>
            <div className="profile-name-row">
              <h2 className="profile-name">{selectedEmployee?.fullName}</h2>
              <span className="profile-badge">{selectedEmployee?.employeeCode}</span>
            </div>
            <p className="profile-meta">
              <strong>{selectedEmployee?.designation}</strong> • {selectedEmployee?.department} • 
              <span className="profile-email"> {selectedEmployee?.email}</span>
            </p>
          </div>
        </div>

        <div className="profile-quick-action">
          <button className="btn btn-outline" onClick={fetchDashboardData} title="Sync latest status">
            🔄 Refresh Metrics
          </button>
        </div>
      </section>

      {/* Metric Cards Row */}
      <section className="metric-section">
        <MetricGrid metrics={metrics} />
      </section>

      {/* Task Roadmap and Management Table */}
      <section className="table-section">
        <TaskTable
          tasks={tasks}
          onEditTask={(task) => setActiveTaskForEdit(task)}
          onDeleteTask={handleDeleteTask}
          onOpenAssignModal={() => setIsAssignModalOpen(true)}
        />
      </section>

      {/* Modals */}
      {activeTaskForEdit && (
        <TaskStatusUpdateModal
          task={activeTaskForEdit}
          onClose={() => setActiveTaskForEdit(null)}
          onSuccess={handleTaskUpdated}
        />
      )}

      {isAssignModalOpen && (
        <AssignTaskModal
          employee={selectedEmployee}
          onClose={() => setIsAssignModalOpen(false)}
          onSuccess={handleTaskAssigned}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
