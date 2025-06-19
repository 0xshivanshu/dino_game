// src/components/Dinosaur.jsx
import React, { forwardRef } from 'react';

// The 'forwardRef' wraps your component function.
// It receives 'props' and 'ref' as arguments.
const Dino = forwardRef((props, ref) => (
  // The ref from the parent is passed to the actual DOM element.
  <div ref={ref} className="absolute w-16 h-16" style={props.style}>
    <svg viewBox="0 0 100 100" fill="#555">
      <rect x="50" y="0" width="40" height="30" rx="5" />
      <rect x="80" y="20" width="20" height="10" />
      <circle cx="65" cy="15" r="3" fill="white" />
      <rect x="20" y="30" width="60" height="40" rx="5" />
      <rect x="30" y="70" width="15" height="20" />
      <rect x="55" y="70" width="15" height="20" />
      <rect x="0" y="40" width="20" height="10" />
    </svg>
  </div>
));

export default Dino;