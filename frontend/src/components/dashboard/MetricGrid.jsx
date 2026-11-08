import React from 'react';
import StatCard from '../common/StatCard';

const MetricGrid = ({ metrics }) => {
  if (!metrics) return null;

  const getScoreVariant = (score) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  const scoreVariant = getScoreVariant(metrics.complianceScore);

  return (
    <div className="metric-grid">
      <StatCard
        title="Total Compliance Tasks"
        value={metrics.totalTasks}
        subtitle="Mandatory baseline checklist"
        icon="📋"
        variant="default"
      />
      <StatCard
        title="Completed Milestones"
        value={metrics.completedTasks}
        subtitle={`${metrics.totalTasks - metrics.completedTasks} remaining`}
        icon="✅"
        variant="success"
      />
      <StatCard
        title="In-Progress / Pending"
        value={metrics.inProgressTasks + metrics.pendingTasks}
        subtitle={`${metrics.inProgressTasks} active, ${metrics.pendingTasks} queued`}
        icon="⏳"
        variant="warning"
      />
      <StatCard
        title="Overdue Attention"
        value={metrics.overdueTasks}
        subtitle={metrics.overdueTasks > 0 ? "Requires manager escalation" : "On schedule"}
        icon="⚠️"
        variant={metrics.overdueTasks > 0 ? "danger" : "default"}
      />
      <StatCard
        title="Compliance Rating"
        value={`${metrics.complianceScore.toFixed(1)}%`}
        subtitle="Audit Readiness Benchmark"
        icon="🎯"
        variant={scoreVariant}
        badge={{
          type: scoreVariant,
          text: metrics.complianceScore >= 80 ? 'Target Met' : 'Action Required',
        }}
      />
    </div>
  );
};

export default MetricGrid;
