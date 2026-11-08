import React, { useState } from 'react';
import { taskService } from '../../services/taskService';

const TaskStatusUpdateModal = ({ task, onClose, onSuccess }) => {
  const [status, setStatus] = useState(task.status);
  const [verificationNotes, setVerificationNotes] = useState(task.verificationNotes || '');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Business rule validation: Completing a compliance task requires evidence/notes
    if (status === 'COMPLETED' && (!verificationNotes || verificationNotes.trim().length < 5)) {
      setFormError('Audit Policy Requirement: Please provide verification proof (e.g. Certificate ID, commit hash, or approval URL).');
      return;
    }

    try {
      setSubmitting(true);
      await taskService.updateTaskStatus(task.id, {
        status,
        verificationNotes: verificationNotes.trim(),
      });
      onSuccess(`Successfully updated task "${task.title}" to ${status}`);
    } catch (err) {
      setFormError(err.message || 'Error updating compliance task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3>Audit Task Review</h3>
            <p className="modal-subtitle">{task.title}</p>
          </div>
          <button className="btn-close" onClick={onClose} disabled={submitting}>✕</button>
        </div>

        {formError && <div className="alert-box alert-error">{formError}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Task Category</label>
            <input type="text" className="form-control text-readonly" value={task.category} readOnly disabled />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="status-select">Compliance Status *</label>
            <select
              id="status-select"
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={submitting}
            >
              <option value="PENDING">PENDING - Awaiting Action</option>
              <option value="IN_PROGRESS">IN_PROGRESS - Work Started</option>
              <option value="COMPLETED">COMPLETED - Milestone Attained</option>
              <option value="OVERDUE">OVERDUE - Target Missed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="verification-notes">
              Verification Proof / Audit Notes {status === 'COMPLETED' ? '*' : '(Optional)'}
            </label>
            <textarea
              id="verification-notes"
              className="form-control"
              rows="4"
              placeholder="e.g. Completed via portal cert ID #SEC-2024-889. Verified git commit 90a1bc4."
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              disabled={submitting}
            />
            <small className="form-help">Evidence is logged into the audit ledger for governance review.</small>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Save & Sync Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskStatusUpdateModal;
