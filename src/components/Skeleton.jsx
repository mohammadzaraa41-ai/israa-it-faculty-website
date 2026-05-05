import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type, className = '' }) => {
  const classes = `skeleton skeleton-${type} ${className}`;
  return <div className={classes} />;
};

export const CardSkeleton = () => (
  <div className="skeleton-card skeleton">
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Skeleton type="circle" />
      <div style={{ flex: 1 }}>
        <Skeleton type="text" style={{ width: '80%' }} />
        <Skeleton type="text" style={{ width: '40%' }} />
      </div>
    </div>
    <Skeleton type="text" />
    <Skeleton type="text" />
    <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
      <Skeleton type="text" style={{ height: '2.5rem', flex: 1 }} />
      <Skeleton type="text" style={{ height: '2.5rem', flex: 1 }} />
    </div>
  </div>
);

export default Skeleton;
