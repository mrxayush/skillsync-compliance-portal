import React, { useState } from 'react';

const TaskTable = ({ tasks, onEditTask, onDeleteTask, onOpenAssignModal, isManager }) => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'badge-status-completed';
      case 'IN_PROGRESS':
        return 'badge-status-in-progress';
      case 'OVERDUE':
        return 'badge-status-overdue';
      default:
        return 'badge-status-pending';
    }
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case 'INFOSEC':
        return 'tag-infosec';
      case 'ENVIRONMENT_SETUP':
        return 'tag-env';
      case 'CODE_STANDARDS':
        return 'tag-code';
      default:
        return 'tag-hr';
    }
  };

  return (
    <div className="task-table-wrapper">
      <div className="table-header-controls">
        <div className="table-heading-group">
          <h3>
            {isManager ? 'Compliance Verification Checklist' : 'My Mandatory Onboarding Roadmap'}
          </h3>
          <p className="section-desc">
            {isManager
              ? 'Audit and oversee developer regulatory milestones and security deliverables.'
              : 'Complete each milestone and submit proof (certificates, commit links) for manager signoff.'}
          </p>
        </div>

        <div className="header-actions">
          {isManager ? (
            <button className="btn btn-primary" onClick={onOpenAssignModal}>
              + Assign Compliance Task
            </button>
          ) : (
            <span className="rbac-notice-badge">🔒 Assigned by Governance Lead</span>
          )}
        </div>
      </div>

      <div className="filter-bar">
        <div className="status-filters">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map((status) => (
            <button
              key={status}
              className={`filter-chip ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h4>No compliance tasks found</h4>
          <p>
            {isManager
              ? 'Try adjusting your search criteria or assign a new task to this developer.'
              : 'You have no tasks matching this filter.'}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Compliance Task</th>
                <th>Category</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Verification Evidence</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <div className="task-title-cell">
                      <span className="task-title">{task.title}</span>
                      {task.description && <span className="task-desc">{task.description}</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`category-tag ${getCategoryClass(task.category)}`}>
                      {task.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="task-date">{task.dueDate}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="verification-notes" title={task.verificationNotes || 'None'}>
                      {task.verificationNotes || (
                        <span className="text-muted">Awaiting submission</span>
                      )}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="action-button-group">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => onEditTask(task)}
                      >
                        {isManager ? 'Audit / Update' : 'Submit Proof'}
                      </button>
                      {/* Only Managers can delete tasks */}
                      {isManager && (
                        <button
                          className="btn btn-sm btn-danger-outline"
                          onClick={() => onDeleteTask(task.id)}
                          title="Delete compliance task (Manager Only)"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
