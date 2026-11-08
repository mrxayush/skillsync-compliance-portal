import api from './api';

export const taskService = {
  // Fetch all employees for manager dropdown
  getAllEmployees: async () => {
    const res = await api.get('/employees');
    return res.data;
  },

  // Fetch dashboard summary metrics for an employee
  getEmployeeDashboardMetrics: async (employeeId) => {
    const res = await api.get(`/employees/${employeeId}/dashboard`);
    return res.data;
  },

  // Fetch tasks assigned to an employee with optional status filter
  getTasksByEmployee: async (employeeId, status = '') => {
    const query = status ? `?status=${status}` : '';
    const res = await api.get(`/tasks/employee/${employeeId}${query}`);
    return res.data;
  },

  // Update compliance task status and verification notes
  updateTaskStatus: async (taskId, payload) => {
    const res = await api.patch(`/tasks/${taskId}/status`, payload);
    return res.data;
  },

  // Assign a new compliance task to an employee
  assignTask: async (taskData) => {
    const res = await api.post('/tasks/assign', taskData);
    return res.data;
  },

  // Delete a task
  deleteTask: async (taskId) => {
    const res = await api.delete(`/tasks/${taskId}`);
    return res.data;
  },
};
