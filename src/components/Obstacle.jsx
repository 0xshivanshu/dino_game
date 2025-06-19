// src/components/Obstacle.jsx
import React, { forwardRef } from 'react';

const Obstacle = forwardRef((props, ref) => (
  <div ref={ref} className="absolute w-8 h-16" style={props.style}>
    <svg viewBox="0 0 32 64" fill="green">
      <rect x="10" y="0" width="12" height="64" />
      <rect x="0" y="20" width="10" height="15" />
      <rect x="22" y="30" width="10" height="15" />
    </svg>
  </div>
));

export default Obstacle;