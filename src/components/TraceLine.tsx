import React from 'react';

interface TraceLineProps {
  className?: string;
}

export const TraceLine: React.FC<TraceLineProps> = ({ className = '' }) => {
  return <div className={`trace-line w-full my-4 ${className}`} />;
};
