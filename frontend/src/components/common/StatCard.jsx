import React from 'react';

const StatCard = ({ title, value, subtitle, icon, variant = 'default', badge }) => {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <div className="stat-card-body">
        <span className="stat-value">{value}</span>
        {badge && <span className={`stat-badge badge-${badge.type}`}>{badge.text}</span>}
      </div>
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
