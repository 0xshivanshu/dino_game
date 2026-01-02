// src/components/Dinosaur.jsx
import React, { forwardRef } from 'react';

const Dinosaur = forwardRef((props, ref) => (
  <div ref={ref} className="absolute w-16 h-16" style={props.style}>
    <svg viewBox="0 0 100 100">
      {/* Body */}
      <ellipse cx="50" cy="55" rx="28" ry="32" fill="#22c55e" />
      
      {/* Head */}
      <circle cx="50" cy="25" r="22" fill="#22c55e" />
      
      {/* Eye */}
      <circle cx="58" cy="20" r="5" fill="white" />
      <circle cx="60" cy="20" r="3" fill="#1f2937" />
      
      {/* Mouth */}
      <path d="M 45 30 Q 50 35 55 30" stroke="#1f2937" strokeWidth="2" fill="none" />
      
      {/* Arms */}
      <ellipse cx="25" cy="50" rx="8" ry="15" fill="#16a34a" />
      <ellipse cx="75" cy="50" rx="8" ry="15" fill="#16a34a" />
      
      {/* Legs */}
      <rect x="35" y="75" width="10" height="18" rx="5" fill="#16a34a" />
      <rect x="55" y="75" width="10" height="18" rx="5" fill="#16a34a" />
      
      {/* Tail */}
      <path d="M 25 60 Q 10 55 15 40" stroke="#16a34a" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  </div>
));

export default Dinosaur;