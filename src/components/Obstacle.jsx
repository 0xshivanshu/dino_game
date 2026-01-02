// src/components/Obstacle.jsx
import React, { forwardRef } from 'react';

const Obstacle = forwardRef((props, ref) => (
  <div ref={ref} className="absolute w-8 h-16" style={props.style}>
    <svg viewBox="0 0 32 64">
      {/* Main trunk */}
      <rect x="10" y="10" width="12" height="54" rx="2" fill="#b45309" />
      
      {/* Left arm */}
      <rect x="2" y="22" width="10" height="6" rx="2" fill="#b45309" />
      <rect x="2" y="22" width="6" height="16" rx="2" fill="#b45309" />
      
      {/* Right arm */}
      <rect x="20" y="34" width="10" height="6" rx="2" fill="#b45309" />
      <rect x="24" y="34" width="6" height="14" rx="2" fill="#b45309" />
      
      {/* Spikes for detail */}
      <circle cx="16" cy="20" r="1" fill="#92400e" />
      <circle cx="16" cy="32" r="1" fill="#92400e" />
      <circle cx="16" cy="44" r="1" fill="#92400e" />
      <circle cx="16" cy="56" r="1" fill="#92400e" />
    </svg>
  </div>
));

export default Obstacle;