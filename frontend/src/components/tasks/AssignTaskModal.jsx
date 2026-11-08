import React, { useState } from 'react';
import { taskService } from '../../services/taskService';

const AssignTaskModal = ({ employee, onClose, onSuccess }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7);
  const defaultDueDate = tomorrow.toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('INFOSEC');
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Task title is required.');
      return;
    }

    if (!dueDate) {
      setFormError('Please select a valid due date.');
      return;
    }

    try {
      setSubmitting(true);
      await taskService.assignTask({
        employeeId: employee.id,
        title: title.trim(),
        description: description.trim(),
        category,
        dueDate,
      });
      onSuccess(`New task "${title}" assigned to ${employee.fullName}`);
    } catch (err) {
      setFormError(err.message || 'Error assigning task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3>Assign Compliance Task</h3>
            <p className="modal-subtitle">Assigning to: {employee.fullName} ({employee.employeeCode})</p>
          </div>
          <button className="btn-close" onClick={onClose} disabled={submitting}>✕</button>
        </div>

        {formError && <div className="alert-box alert-error">{formError}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Task Title *</label>
            <input
              id="task-title"
              type="text"
              className="form-control"
              placeholder="e.g. AWS Security Baseline Verification"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">Task Description</label>
            <textarea
              id="task-desc"
              className="form-control"
              rows="3"
              placeholder="Outline specific compliance steps or checklist links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group col-half">
              <label className="form-label" htmlFor="task-category">Category *</label>
              <select
                id="task-category"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={submitting}
              >
                <option value="INFOSEC">INFOSEC (Security & Privacy)</option>
                <option value="ENVIRONMENT_SETUP">ENVIRONMENT_SETUP (Tooling & Keys)</option>
                <option value="HR_POLICY">HR_POLICY (Corporate & Legal)</option>
                <option value="CODE_STANDARDS">CODE_STANDARDS (Engineering Rules)</option>
              </select>
            </div>

            <div className="form-group col-half">
              <label className="form-label" htmlFor="task-duedate">Due Date *</label>
              <input
                id="task-duedate"
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;
